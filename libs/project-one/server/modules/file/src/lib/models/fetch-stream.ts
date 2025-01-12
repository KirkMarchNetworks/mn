export interface FetchStreamParamsInterface {
  src: string;
  onWrite: (chunk: Uint8Array) => void;
  opts?: {
    // The minimum desired chunk size, each chunk will be at least this size, except last chunk.
    minimumChunkSize: number;
  }
}

export class FetchStream {
  private _hasInitialized = false;
  private _params: Required<FetchStreamParamsInterface>;
  private _abortController = new AbortController();
  private _totalLength = 0;
  private _body: ReadableStream<Uint8Array>|undefined;

  constructor(
    {
      src,
      onWrite,
      opts = {
        minimumChunkSize: 65536 // default to 64kb
      },
    }: FetchStreamParamsInterface) {
    this._params = {
      src,
      onWrite,
      opts
    };
  }

  abort() {
    this._abortController.abort();
  }

  async initiate() {
    if (this._hasInitialized) {
      // You may only initialize one time, create another new class if you need another stream.
      throw new Error('Already initialized');
    }
    this._hasInitialized = true;

    const signal = this._abortController.signal;
    const { body, headers } = await fetch(this._params.src, { signal });

    if (!body) {
      throw new Error('No body');
    }

    this._body = body;

    if (!headers.has('content-length')) {
      throw new Error('No content-length');
    }

    this._totalLength = Number(headers.get('content-length'));

    return headers;
  }

  async start() {
    if (!this._hasInitialized || !this._body) {
      // You must initialize the stream first before calling start.
      throw new Error('Not yet initialized');
    }

    let bytesRead = 0;

    let buffer: Uint8Array[] = [];
    let bufferSize = 0;

    // resets the buffer, returns the concatenated chunk
    const pop = () => {
      const chunk: Uint8Array = this._concat(bufferSize, buffer);
      bufferSize = 0;
      buffer = [];
      return chunk;
    };

    const minimumChunkSizeTransformer = new TransformStream<Uint8Array>({
      transform: (value, controller) => {
        const lastBytes = value.length === (this._totalLength - bytesRead);

        // accumulate buffer
        bufferSize += value.length;
        buffer.push(value);

        // desired chunk size reached or last bytes
        if (bufferSize >= this._params.opts.minimumChunkSize || lastBytes) {
          controller.enqueue(pop());
        }

        bytesRead += value.length;
      }
    });

    const sink = new WritableStream<Uint8Array>({
      write: (value) => {
        this._params.onWrite(value);
      },
    });

    await this._body.pipeThrough(minimumChunkSizeTransformer).pipeTo(sink);
  }

  private _concat(size: number, buffers: Uint8Array[]) {
    const merged = new Uint8Array(size);
    let offset = 0;
    buffers.forEach(buffer => {
      merged.set(buffer, offset);
      offset += buffer.length;
    });
    return merged;
  }
}

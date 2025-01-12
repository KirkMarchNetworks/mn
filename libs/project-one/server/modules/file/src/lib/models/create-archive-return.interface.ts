import { Archiver } from "archiver";
import { ReadStream } from "fs";

export interface CreateArchiveReturnInterface {
  append: (...args: Parameters<Archiver['append']>) => void;
  finalizeAndComplete: () => Promise<ReadStream>;
}

import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent, serverConfig } from '@mn/project-one/client/root';


const bootstrap = () => bootstrapApplication(RootComponent, serverConfig);

export default bootstrap;

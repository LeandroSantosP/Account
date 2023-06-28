import { ExpressAdapter } from "./infra/http/api/ExpressAdapter";
import { Routers } from "./infra/http/api/Routers";

const http = new ExpressAdapter();

new Routers(http);

http.listen();

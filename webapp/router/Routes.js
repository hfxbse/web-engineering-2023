import {sessionActive} from "/Session.js";
import {userRoot} from "/views/FileBrowser.js";
import "/views/AuthenticationForm.js"
import "/views/NotFound.js"

export class RouteMatch {
    constructor(match, redirect) {
        this.match = match;
        this.redirect = redirect;
    }
}

export class Route {
    constructor({tag, match, attributes, priority}) {
        this.tag = tag;
        this.match = match ? match : () => false;
        this.attributes = attributes;
        this.priority = priority ? priority : 0;
    }
}

const authPath = '/auth'

function isAuthPath() {
    return new RegExp(`^\\${authPath}\/?$`).test(location.pathname)
}

function directoryRoot() {
    return location.pathname === '/' || location.pathname.startsWith(userRoot())
}

const routes = {
    notFound: new Route({
        tag: 'not-found',
        match: () => new RouteMatch(true),
        priority: -1
    }),
    auth: new Route({
        tag: 'authentication-form',
        match: () => {
            const redirect = !isAuthPath() ?
                `${authPath}?redirect=${encodeURI(location.pathname + location.search)}` :
                undefined;

            return new RouteMatch(!sessionActive(), redirect);
        },
        priority: 1
    }),
    files: new Route({
        tag: 'file-browser',
        match: () => new RouteMatch(
            directoryRoot() || isAuthPath() && sessionActive(),
            isAuthPath() || location.pathname === '/' ? userRoot() : undefined
        ),
    })
}

export default routes

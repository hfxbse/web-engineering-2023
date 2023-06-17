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

function isAuthPath(path) {
    return new RegExp(`^\\${authPath}\/?$`).test(path)
}

function directoryRoot(path) {
    return path === '/' || path.startsWith(userRoot())
}

const routes = {
    notFound: new Route({
        tag: 'not-found',
        match: () => new RouteMatch(true),
        priority: -1
    }),
    auth: new Route({
        tag: 'authentication-form',
        match: (path) => {
            const redirect = !isAuthPath(path) ?
                `${authPath}?redirect=${encodeURI(path + location.search)}` :
                undefined;

            return new RouteMatch(!sessionActive(), redirect);
        },
        priority: 1
    }),
    files: new Route({
        tag: 'file-browser',
        match: (path) => new RouteMatch(
            directoryRoot(path) || isAuthPath(path) && sessionActive(),
            isAuthPath(path) || path === '/' ? userRoot() : undefined
        ),
    })
}

export default routes

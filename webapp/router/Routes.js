import {sessionActive, sessionData} from "/Session.js";
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

function userRoot() {
    return `/@${sessionData().user}`
}

function isAuthPath() {
    return location.pathname === authPath;
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
        attributes: () => ({
            redirect: !isAuthPath() ? location.pathname : '/'
        }),

        match: () => new RouteMatch(!sessionActive(), authPath),
        priority: 1
    }),
    files: new Route({
        tag: 'div',
        match: () => new RouteMatch(
            directoryRoot() || location.pathname === authPath && sessionActive(),
            isAuthPath() || location.pathname === '/' ? userRoot() : undefined
        ),
    })
}

export default routes

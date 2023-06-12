import router from "./Router.js";
import {sessionData} from "../Session.js";
import "../views/AuthenticationForm.js"

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


const routes = {
    auth: new Route({
        tag: 'authentication-form',
        attributes: () => ({
            redirect: !isAuthPath() ? location.pathname : '/'
        }),

        match: () => new RouteMatch(!router.activeSession, authPath)
    }),
    files: new Route({
        tag: 'div',
        match: () => new RouteMatch(router.activeSession, isAuthPath() ? userRoot() : undefined)
    })
}

export default routes

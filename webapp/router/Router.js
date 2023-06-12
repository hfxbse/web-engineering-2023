import routes from "./Routes.js";

class Router {
    constructor(activeSession, pushCallback) {
        this.activeSession = activeSession
        this.pushCallback = pushCallback
    }

    route() {
        const matches = Object.keys(routes)
            .map(key => ({name: key, match: routes[key].match()}))
            .filter(route => route.match.match)

        matches.sort((a, b) => {
            return routes[b.name].priority - routes[a.name].priority
        })

        if (matches.length === 0) {
            throw {routingIssue: 'No route found'}
        }

        const {name: routeName, match} = matches[0];
        const route = routes[routeName];
        const tag = this.createTag(route);

        if (match.redirect) history.replaceState(undefined, undefined, match.redirect)

        return tag;
    }

    createTag(route) {
        let attributes = route.attributes ? route.attributes() : {}
        attributes = Object.keys(attributes).map(key => `${key}="${attributes[key]}"`).join(" ")

        return `<${route.tag} ${attributes}></${route.tag}>`
    }

    push(url) {
        history.pushState(undefined, undefined, url)
        if (this.pushCallback) this.pushCallback();
    }
}

const router = new Router(false);
export default router

import routes from "./Routes.js";

class Router {
    constructor(pushCallback) {
        this.pushCallback = pushCallback
    }

    route() {
        const matches = Object.keys(routes)
            .map(key => ({
                name: key,
                match: routes[key].match(this.removeDuplicatedSlashes(location.pathname))
            }))
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

        if (match.redirect) history.pushState(
            undefined,
            undefined,
            this.removeDuplicatedSlashes(match.redirect)
        )

        return tag;
    }

    createTag(route) {
        const element = document.createElement(route.tag)

        if (route.attributes) {
            const attributes = route.attributes()
            Object.keys(attributes).forEach((property) =>
                element.setAttribute(property, attributes[property])
            )
        }

        return element;
    }

    push(url) {
        history.pushState(undefined, undefined, this.removeDuplicatedSlashes(url))
        if (this.pushCallback) this.pushCallback();
    }

    removeDuplicatedSlashes(path) {
        return path.replace(/\/+/g, '/')
    }
}

const router = new Router();
export default router

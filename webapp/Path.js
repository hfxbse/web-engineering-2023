export function currentEntryPath() {
    return location.pathname.split(/\/+/).slice(2).join('/');
}

export function currentEntryName() {
    let path = currentEntryPath().split('/')
    return path[path.length - 1]
}

export function parentDirectoryURL() {
    if (/\/.+/.test(location.pathname.slice(1))) {
        let parent = location.pathname.replace(/\/+/g, '/')
        if (parent.endsWith("/")) parent = parent.slice(0, parent.length - 1)

        return parent.slice(0, parent.lastIndexOf("/"))
    }
}

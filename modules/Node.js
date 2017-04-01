/**
 * Created by b1ncer on 2017/4/1.
 */
export default class Node {

    constructor() {
        this._parent = null
        this._children = new Set()
    }

    add(node) {
        this._children.add(node)
        node._parent = this
    }

    remove(node) {
        if (this._children.delete(node)) {
            node._parent = null
        }
    }

    traversal(cb) {
        this._children.forEach(node => {
            cb(node)
            node.traversal(cb)
        })
    }
}

export class Tree {

    constructor(node) {
        if (!node) {
            throw new Error('node cannot be null')
        }
        this._root = node
    }

    traversal(cb) {
        this._root.traversal(cb)
    }
}
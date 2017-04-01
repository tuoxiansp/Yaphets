/**
 * Created by b1ncer on 2017/4/1.
 */
import Node from './Node'
import Transform from './lib/Transform'

export default class RenderNode extends Node {

    constructor(options = {}) {
        super()
        this._cache = {}
        const {
            transform = Transform.identity
        } = options
        this.transform = transform
    }

    get finalTransform() {
        let finalTransform = this._cache.finalTransform
        if (!finalTransform) {
            let parentFinalTransform = this._parent ? this._parent.finalTransform : Transform.identity
            finalTransform = Transform.multiply4x4(parentFinalTransform, this.transform)
        }
        return finalTransform
    }

    add(...args) {
        super.add(...args)
        this._cache = {}
    }

    remove(...args) {
        super.remove(...args)
        this._cache = {}
    }

    set transform(transform) {
        this._clearCache('finalTransform')
        this._transform = transform
    }

    get transform() {
        return this._transform
    }

    _clearCache(channel) {
        this._cache[channel] = null
        this.traversal(lazyNode => {
            lazyNode.clearCache(channel)
        })
    }
}
/**
 * Created by b1ncer on 2017/4/1.
 */
import Transform from './lib/Transform'
import Node from './Node'

export class RenderNode extends Node {

    constructor(options = {}) {
        super()
        this._cache = {}
        const {
            transform = Transform.identity
        } = options
        this.transform = transform
    }

    get finalTransform() {
        let finalTransform = this.getCache('finalTransform')
        if (!finalTransform) {
            let parentFinalTransform = this._parent ? this._parent.finalTransform : Transform.identity
            finalTransform = Transform.multiply4x4(parentFinalTransform, this.transform)
            this.setCache('finalTransform', finalTransform)
        }
        return finalTransform
    }

    add(...args) {
        super.add(...args)
        this.clearAllCache()
    }

    remove(...args) {
        super.remove(...args)
        this.clearAllCache()
    }

    set transform(transform) {
        this.cleanCache('finalTransform')
        this._transform = transform
    }

    get transform() {
        return this._transform
    }

    getCache(prop) {
        return this._cache[prop]
    }

    setCache(prop, value) {
        this._cache[prop] = value
    }

    cleanCache(prop) {
        const cache = this.getCache(prop)
        if (cache === null || cache === undefined) {
            this._children.forEach(child => {
                child.cleanCache(prop)
            })
            this.setCache(prop, null)
        }
    }

    clearAllCache() {
        const cache = this._cache
        if (Object.keys(cache).length > 0) {
            this._children.forEach(child => {
                child.clearAllCache()
            })
            this._cache = {}
        }
    }
}

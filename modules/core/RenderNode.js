/**
 * Created by b1ncer on 2017/4/1.
 */
import Transform from '../lib/Transform'
import Node from './Node'

const DIRECTION = {
    X: 0,
    Y: 1,
    Z: 2
}

export default class RenderNode extends Node {

    constructor(options = {}) {
        super()
        this._cache = {}
        const {
            transform = Transform.identity,
            opacity = 1,
            mountPoint = [0, 0],
            size = [0, 0],
            align = [0, 0]
        } = options
        this.transform = transform
        this.opacity = opacity
        this.mountPoint = mountPoint
        this.size = size
        this.align = align
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

    get calculatedTransform() {
        const translate = Transform.getTranslate(this.transform)
        let calX = translate[DIRECTION.X] + this.size[DIRECTION.X] * this.mountPoint[DIRECTION.X],
            calY = translate[DIRECTION.Y] + this.size[DIRECTION.Y] * this.mountPoint[DIRECTION.Y]

        const parentSize = this._parent ? this._parent.size : [0, 0]
        calX = parentSize[DIRECTION.X] * this.align[DIRECTION.X] + calX
        calY = parentSize[DIRECTION.Y] * this.align[DIRECTION.Y] + calY

        const copiedTransform = Object.assign([], this.transform)
        copiedTransform[12] = calX
        copiedTransform[13] = calY

        return copiedTransform
    }

    get finalTransform() {
        let finalTransform = this.getCache('finalTransform')
        if (!finalTransform) {
            let parentFinalTransform = this._parent ? this._parent.finalTransform : Transform.identity
            finalTransform = Transform.multiply4x4(parentFinalTransform, this.calculatedTransform)
            this.setCache('finalTransform', finalTransform)
        }
        return finalTransform
    }

    set opacity(value) {
        this.cleanCache('finalOpacity')
        this._opacity = value
    }

    get opacity() {
        return this._opacity
    }

    get finalOpacity() {
        let finalOpacity = this.getCache('finalOpacity')
        if (!finalOpacity) {
            let parentFinalOpacity = this._parent ? this._parent.finalOpacity : 1
            finalOpacity = parentFinalOpacity * this.opacity
            this.setCache('finalOpacity', finalOpacity)
        }
        return finalOpacity
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

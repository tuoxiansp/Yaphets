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
        this._listener = new Set()
        this._willUpdate = false
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
        this._destroy = false
    }

    //[fn]
    addListener(listener) {
        if (typeof listener != 'function') {
            throw new Error('Listener must be a function')
        }
        return this._listener.add(listener)
    }

    once(listener) {
        if (typeof listener != 'function') {
            throw new Error('Listener must be a function')
        }
        const wrapper = (...args) => {
            listener(...args)
            this.removeListener(wrapper)
        }
        this.addListener(wrapper)
        return wrapper
    }

    removeListener(listener) {
        return this._listener.delete(listener)
    }

    output() {
        const self = this
        const getter = {
            get transform() {
                return self.transform
            },
            get finalTransform() {
                return self.finalTransform
            },
            get opacity() {
                return self.opacity
            },
            get finalOpacity() {
                return self.finalOpacity
            },
            get mountPoint() {
                return self.mountPoint
            },
            get size() {
                return self.size
            },
            get align() {
                return self.align
            }
        }
        this._listener.forEach(listener => {
            listener(getter)
        })
    }

    add(node) {
        super.add(node)
        node.clearAllCache()
    }

    remove(node) {
        super.remove(node)
    }

    destroy() {
        if (this._destroy) return

        this._destroy = true
        this._listener.clear()
        if (this._parent) {
            this._parent.remove(this)
        }
        this._children.forEach(child => {
            child.destroy()
        })
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

    set mountPoint(value) {
        this.cleanCache('finalTransform')
        this._mountPoint = value
    }

    get mountPoint() {
        return this._mountPoint
    }

    set size(value) {
        this.cleanCache('finalTransform')
        this._size = value
    }

    get size() {
        return this._size
    }

    set align(value) {
        this.cleanCache('finalTransform')
        this._align = value
    }

    get align() {
        return this._align
    }

    getCache(prop) {
        return this._cache[prop]
    }

    setCache(prop, value) {
        this._cache[prop] = value
    }

    cleanCache(prop) {
        const cache = this.getCache(prop)
        if (!(cache === null || cache === undefined)) {
            this._children.forEach(child => {
                child.cleanCache(prop)
            })
            this.setCache(prop, null)
        }
        if (!this._willUpdate) {
            requestAnimationFrame(this.output.bind(this))
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
        if (!this._willUpdate) {
            requestAnimationFrame(this.output.bind(this))
        }
    }
}

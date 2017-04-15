/**
 * Created by b1ncer on 2017/4/10.
 */
import React, {PureComponent} from 'react'
import Node from '../core/RenderNode'
import PropTypes from 'prop-types'

const devicePixelRatio = window.devicePixelRatio || 1

export default class RenderNode extends PureComponent {

    static childContextTypes = {
        node: PropTypes.object
    }

    static contextTypes = {
        node: PropTypes.object
    }

    constructor(...args) {
        super(...args)
        this._node = new Node()
        this._node.addListener((node) => {
            this.syncWithNode(node)
        })
        if (this.context.node) {
            this.context.node.add(this._node)
        }
    }

    syncWithNode(node) {
        if (this._dom) {
            this._dom.style.opacity = node.opacity
            this._dom.style.width = node.width + 'px'
            this._dom.style.height = node.height + 'px'
            this._dom.style.transform = this._formatCSSTransform(node.transform)
        }
    }

    _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio
        m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio

        let res = 'matrix3d('
        for (let i = 0; i < 15; i++) {
            const n = m[i]
            res += (n < 0.000001 && n > -0.000001) ? '0,' : n + ','
        }
        res += m[15] + ')'
        return res
    }

    componentWillUnmount() {
        this.context.node.remove(this._node)
    }

    getChildContext() {
        return {
            node: this._node
        }
    }

    render() {
        const {
            transform,
            opacity,
            mountPoint,
            size,
            align
        } = this.props

        this._node.transform = transform
        this._node.opacity = opacity
        this._node.mountPoint = mountPoint
        this._node.size = size
        this._node.align = align

        return (
            <div
                style={{
                    position: 'absolute',
                    transformOrigin: 'center center',
                    transformStyle: 'preserve-3d',
                    boxSizing: 'border-box',
                    websiteTapHighlightColor: 'transparent',
                    pointerEvents: 'auto',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }}
                ref={div => this._dom = div}
            >
                {this.props.children}
            </div>
        )
    }
}
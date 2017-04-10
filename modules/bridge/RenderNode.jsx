/**
 * Created by b1ncer on 2017/4/10.
 */
import React, {Component} from 'react'
import Node from '../core/RenderNode'
import PropTypes from 'prop-types'

class RenderNode extends Component {

    static childContextTypes = {
        node: PropTypes.object
    }

    static contextTypes = {
        node: PropTypes.object
    }

    constructor(...args) {
        super(...args)
        const {
            transform,
            opacity,
            mountPoint,
            size,
            align
        } = this.props
        this._node = new Node({
            transform,
            opacity,
            mountPoint,
            size,
            align
        })
        this.context.node.add(this._node)
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
        return this.props.children
    }
}
/**
 * Created by b1ncer on 2017/4/12.
 */
import React, {Component} from 'react'

const RenderRoot = ({children}) =>
    <div
        style={{
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            opacity: 1,
            overflow: 'hidden',
            transformStyle: 'preserve-3d'
        }}
    >
        {children}
    </div>

export default RenderRoot
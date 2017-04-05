/**
 * Created by b1ncer on 2017/4/1.
 */
import RenderNode from '../RenderNode'
import expect from 'expect'
import Transform from '../lib/Transform'

describe('RenderNode', () => {

    const renderNode = new RenderNode()

    it('new RenderNode', done => {

        expect(renderNode).toExist()
        done()
    })

    it('transform', done => {

        expect(renderNode.transform).toEqual(Transform.identity)
        done()
    })

    const renderNode2 = new RenderNode({
        transform: Transform.translate(100, 100, 100)
    })

    const renderNode3 = new RenderNode({
        transform: Transform.translate(400, 400)
    })

    const renderNode4 = new RenderNode()

    it('add renderNode with transform', done => {

        renderNode.add(renderNode2)
        expect(Transform.getTranslate(renderNode2.finalTransform)).toEqual([100, 100, 100])

        expect(Transform.getTranslate(renderNode3.finalTransform)).toEqual([400, 400, 0])

        renderNode2.add(renderNode3)
        expect(Transform.getTranslate(renderNode3.finalTransform)).toEqual([500, 500, 100])

        renderNode2.add(renderNode4)

        done()
    })

    it('verify cache auto clean', done => {
        renderNode2.transform = Transform.translate(200, 100, 0)

        expect(Transform.getTranslate(renderNode2.finalTransform)).toEqual([200, 100, 0])

        expect(Transform.getTranslate(renderNode3.finalTransform)).toEqual([600, 500, 0])

        expect(Transform.getTranslate(renderNode4.finalTransform)).toEqual([200, 100, 0])

        done()
    })
})
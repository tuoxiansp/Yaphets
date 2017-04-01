/**
 * Created by b1ncer on 2017/4/1.
 */
import expect from 'expect'
import Node, {Tree} from '../Node'
import {Set} from 'es6-structs'
if (!window.Set) {
    window.Set = Set
}

describe('Node', () => {
    const node = new Node()
    it('new node', done => {

        expect(node).toExist()
        done()
    })

    const node2 = new Node()
    it('add', done => {

        node.add(node2)
        expect(node._children.size).toBe(1)
        done()
    })

    it('remove', done => {

        node.remove(node2)
        expect(node._children.size).toBe(0)
        done()
    })

    it('traversal', done => {

        node.add(node2)
        const node3 = new Node()
        node2.add(node3)
        let num = 0
        function count(node) {
            num++
        }
        node.traversal(count)
        expect(num).toBe(2)
        num = 0
        node2.traversal(count)
        expect(num).toBe(1)
        node2.add(new Node())
        node2.add(new Node())
        num = 0
        node.traversal(count)
        expect(num).toBe(4)
        done()
    })

    it('tree', done => {

        const tree = new Tree(node)
        expect(tree).toExist()
        expect(tree._root).toExist()
        done()
    })
})
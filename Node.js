"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by b1ncer on 2017/4/1.
 */
var Node = function () {
    function Node() {
        _classCallCheck(this, Node);

        this._parent = null;
        this._children = new Set();
    }

    Node.prototype.add = function add(node) {
        this._children.add(node);
    };

    Node.prototype.remove = function remove(node) {
        this._children.delete(node);
    };

    Node.prototype.traversal = function traversal(cb) {
        this._children.forEach(function (node) {
            cb(node);
            node.traversal(cb);
        });
    };

    return Node;
}();

exports.default = Node;
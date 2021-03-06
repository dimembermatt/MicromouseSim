/**
 * m_Node.js
 * Author: Matthew Yu
 * Last modified: 10/24/18
 *
 * This file describes the Node class and the functions that it uses.
 * The Node object. This variable is exported to the global namespace.
 * API is made available through this object.
 *
 */
/**
 * @class node: the junction and its relationship to the maze.
 * @param _id - id number of the node.
 * @param _position - the cell position in X,Y format.
 * @param _neighbors - north, east, south, west: Neighbor objects.
 *     default neighbor objects are null (unexplored).
 */
var node;
if (!node){
    node = {};
}

//start closure
(function (){
//Global variables to this closure
var id;
var position;
var neighbors;
//public API functions
/**
 * @function initializeNode - sets the node with an id, position, neighbors
 */
if (typeof node.initializeNode !== 'function') {
node.initializeNode = function(_id = 0, _position = [0,0], _neighbors = [null, null, null, null]) {
    id = _id;
    position = _position;
    neighbors = _neighbors;
}; }
if (typeof node.getID !== 'function') {
node.getID = function() {
    return id;
}; }
if (typeof node.getPosition !== 'function') {
node.getPosition = function() {
    return position;
}; }
if (typeof node.getNeighbors !== 'function') {
node.getNeighbors = function() {
    return neighbors;
}; }

/**
 *  @function addRelation - given the previous and newly reached node,
 *     adjust the node to add connections or prune the wall.
 *  @param prevNode (implicit) : Node
 *     the previous Node that the mouse was just at.
 *     NOTE: call this function like prevNode.addRelation(currNode, ...)
 *  @param currNode : Node
 *     the node that the mouse has currently reached
 *  @param dirLeft : int
 *     the direction that the mouse left from the previous node.
 *  @param dirEntered : int
 *     the direction that the mouse entered into the current node.
 *  @param mvDist : int
 *     the distance between the two nodes in travel displacement
 */
if (typeof node.addRelation !== 'function') {
node.addRelation = function(currNode, dirLeft, dirEntered, mvDist) {
    if(id == currNode.id){
        neighbors[dirLeft].setNeighborPath(0);
        neighbors[dirEntered].setNeighborPath(0);
    }else{
        neighbors[dirLeft].setNeighborId(currNode.id);
        neighbors[dirLeft].setNeighborDist(mvDist);
        currNode.neighbors[dirEntered].setNeighborId(prevNode.id);
        currNode.neighbors[dirEntered].setNeighborDist(mvDst);
    }
}; }
}());

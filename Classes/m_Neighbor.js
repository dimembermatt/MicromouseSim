/**
 * m_Neighbor.js
 * Author: Matthew Yu
 * Last modified: 10/24/18
 *
 * This file describes the Neighbor class and the functions that it uses.
 */
 /**
  * @class neighbor: the relationship between two nodes.
  * @param _id - id number of the connected node.
  * @param _pathBool - whether or not a path exists to a node.
  *     1 = no wall, 0 = wall
  * @param _distance - the distance between nodes (in unit hamming distance cells).
  */
var neighbor;
if (!neighbor){
  neighbor = {};
}

//start closure
(function (){
//Global variables to this closure
var id;
var pathBool;
var distance;
//public API functions
/**
 * @function initializeNode - sets the node with an id, position, neighbors
 */
if (typeof neighbor.initializeNode !== 'function') {
neighbor.initializeNode = function(_id = 0, _pathBool = 0, _distance = 0) {
    id = _id;
    pathBool = _pathBool;
    distance = _distance;
}; }

if (typeof neighbor.getNeighborId !== 'function') {
neighbor.getNeighborId = function() {
    return id;
}; }
if (typeof neighbor.getAccessible !== 'function') {
neighbor.getAccessible = function() {
    return pathBool;
}; }
if (typeof neighbor.getDistance !== 'function') {
neighbor.getDistance = function() {
    return distance;
}; }

if (typeof neighbor.setNeighborId !== 'function') {
neighbor.setNeighborId = function(_id) {
    id = _id;
}; }
if (typeof neighbor.setNeighborPath !== 'function') {
neighbor.setNeighborPath = function(_pathBool) {
    pathBool = _pathBool;
}; }
if (typeof neighbor.setNeighborDist !== 'funciton') {
neighbor.setNeighborDist = function(_distance) {
    distance = _distance;
}; }
}());

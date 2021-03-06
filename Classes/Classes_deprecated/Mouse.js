/**
 * mmouse.js
 * Author: Matthew Yu
 * Last modified: 10/24/18
 *
 * This file describes the mmouse class and the functions that it uses.
 * This class is dependent on the following classes and their source files:
 *      @class Node m_Node.js
 *      @class Neighbor m_Neighbor.js
 * This class also calls the methods available from the mmouse API
 * from the MicromouseSimulator.
 * https://github.com/bblodget/MicromouseSim/wiki/Mouse-API
 */
var mmouse;
if (!mmouse){
    mmouse = {};
}
//start closure
(function (){

//Global variables to this closure
var position;
var mvDir;

//public API functions
if (typeof mmouse.getPosition !== 'function') {
mmouse.getPosition = function() {
    return position;
}; }
/**
 *  @function findDir - determines the direction the mmouse should travel after
 *     reaching a junction
 *  @param pos : int[2]
 *     (x,y) coordinates of the mmouse.
 *  @param dir : int
 *     absolute direction the mmouse entered the current junction from.
 *     0=N, 1=E, 2=S, 3=W
 *  @return int
 *     direction mmouse should now go (0=N, 1=E, 2=S, 3=W)
 */
if (typeof mmouse.findDir !== 'function') {
mmouse.findDir = function(pos, dir) {
    let cell = [...Array(5)].map(e => Array(2).fill(value));
    //find directions with open walls
    cell[0] = getCellType();    //only access first 4 entries since 5th is no of open walls
    //determine HammingDist of each direction
    for(let i = 0; i < 4; i++){
        //if direction has no wall
        if(cell[0][i] == 1){
            //if direction is not from where the mmouse came from
            if(dir != i)
                cell[1][i] = findHammingDist(pos, i);
        //if direction has wall
        }else{
            cell[1][i] = -1;
        }
    }
    //choose direction with neighbor cell with smallest Hamming dist to center
    let bestDir = 0;
    for(let i = 0; i < 4; i++){
        if (cell[1][i] < cell[1][bestDir])
            bestDir = i;
    }

    return bestDir;
}; }
/**
 *  @function movePath - directs a mmouse along a corridor until it reaches a junction.
 *  @param pos : int[2]
 *     (x,y) coordinates of the mmouse before it starts moving.
 *  @param dir :int
 *     absolute direction the mmouse leaves from the current junction
 *  @return int[2], where [0] = int[2]
 *     location - [newPos, moveDist, directionEntered]
 */
if (typeof mmouse.movePath !== 'function') {
mmouse.movePath = function(pos, dir) {
    let activeDir = dir;
    let mvDst = 0;
    let cell;
    let deadEnd = false;

    //hardware driver funct - move the mmouse an arbitrary distance (1 cell)
    //in the activeDirection

    //go one cell into the corridoor.
    moveMouse(activeDir);

    //hardware driver funct - use onboard IR sensors to determine which directions are open
    //requires the mmouse absolute direction and returns a struct containing the
    //status of each direction (wall or not) and the number of directions open
    cell = getCellType();
    //while cell is a dead end or corridor
    while(cell[4] == 1 || cell[4] == 2){
        //if cell is a corridor
        if(cell[4] == 2){
            //if cell is at a corner - wall exists in front
            if(cell[activeDir == 0]){
                //"block" off path from behind
                if(activeDir == 0 || activeDir == 1){
                    cell[activeDir+2] = 0;
                }
                else{
                    cell[activeDir-2] = 0;
                }
                //change active direction based on what side is open
                for(let i = 0; i < 4; i++){
                    if(cell[i] == 1){
                        activeDir = i;
                    }
                }
            }
            //change position based on direction to move before moving
            switch(activeDir){
                case 0:
                    pos[1]++;
                    break;
                case 1:
                    pos[0]++;
                    break;
                case 2:
                    pos[1]--;
                    break;
                case 3:
                    pos[0]--;
                    break;
            }
        }

        //if cell is a dead eand
        if(cell[4] == 1){
            deadEnd = true;
            //flip activeDir - turn around
            if(activeDir == 0 || activeDir == 1){
                activeDir += 2;
            }
            else{
                activeDir -= 2;
            }
        }
        mvDst++;
        moveMouse(activeDir);
        cell = getCellType();
    }
    //assumption is that dead ends mean you return to the previous junction
    if(deadEnd)
        return [pos, 0];
    else
        return [pos, mvDst, activeDir];
}; }

//private functions
/**
  *  @function moveMouse - move the mmouse an arbitrary distance (1 cell)
  *      in a given absolute direction
  *  @param activeDir : int
  *     direction to move towards.
  */
function moveMouse(activeDir){
     let facing = mmouse.heading();
     switch(facing){
         case 'N':
             break;
         case 'E':
             mmouse.left();
             break;
         case 'S':
             mmouse.left(2);
             break;
         case 'W':
             mmouse.right(1);
             break;
     }
     switch(activeDir){
         case 0: //N
             mmouse.fwd();
             break;
         case 1: //E
             mmouse.right();
             mmouse.fwd();
             break;
         case 2: //S
             mmouse.right(2);
             mmouse.fwd();
             break;
         case 3: //W
             mmouse.left();
             mmouse.fwd();
             break;
     }
 }
/**
  *  @function getCellType - uses IR sensors to determine existence of walls
  *      in each absolute direction
  *  @return int[5]
  *      first 4 indices refer to each direction, N/E/S/W,
  *      and 1 = no wall, 0 = wall; 5th index is the no. of open walls
  */
function getCellType(){
      let cell = [0, 0, 0, 0, 0];
      let facing = mmouse.heading();
      switch(facing){
          case 'N':
              break;
          case 'E':
              mmouse.left();
              break;
          case 'S':
              mmouse.left(2);
              break;
          case 'W':
              mmouse.right(1);
              break;
      }
      if(mouse.isPathFwd()){
          cell[0] = 1;
          cell[4]++;
      }
      if(mouse.isPathRight()){
          cell[1] = 1;
          cell[4]++;
      }
      if(mouse.isPathBack()){
          cell[2] = 1;
          cell[4]++;
      }
      if(mouse.isPathLeft()){
          cell[3] = 1;
          cell[4]++;
      }
      return cell;
  }
/**
   *  @function findHammingDist - given a position and direction to move towards,
   *     findHammingDist finds the distance to the center of the field.
   *  @param pos : int[2]
   *     (X, Y) coordinate of the mmouse.
   *  @param dir : int
   *     direction of possible travel. 0=N, 1=E, 2=S, 3=W
   */
function findHammingDist(pos, dir){
      switch(dir){
          case 0:
              pos[1]++;
              break;
          case 1:
              pos[0]++;
              break;
          case 2:
              pos[1]--;
              break;
          case 3:
              pos[0]--;
              break;
      }
      if(pos[0] > 7){
          if(pos[1] > 7)
              return abs(pos[0]-8) + abs(pos[1]-8);
          else
              return abs(pos[0]-8) + abs(pos[1]-7);
      }else{
          if(pos[1] > 7)
              return abs(pos[0]-7) + abs(pos[1]-8);
          else
              return abs(pos[0]-7) + abs(pos[1]-7);
      }
  }

//Mouse API defined functions
// var heading = function(){};
// var left = function(){};
// var right = function(){};
// var forward = function(){};
// var isPathFwd = function(){};
// var isPathBack = function(){};
// var isPathLeft = function(){};
// var isPathRight = function(){};
}());

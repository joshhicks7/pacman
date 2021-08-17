import React, { useState, useEffect} from 'react'
import './Game.css'
import GameMap from './Map'

export default function Game() 
{
    function node(position, distance, rootDistance, manhattanD, parent, discovered)
    {
        this.position = position;
        this.distance = distance;
        this.rootDistance = rootDistance;
        this.manhattanD = manhattanD;
        this.parent = parent;
        this.discovered = discovered;
    }
    
    function getEnemyNextPos(enemy)
    {       
        let distance = Math.sqrt(Math.pow(Math.abs(enemy[1][0] - myState.playerPos[0]) + Math.abs(enemy[1][0] - myState.playerPos[0]),2))
        //if(enemy[0].join() == enemy[1].join() ||  distance <= 5)
        {
            //console.log("Same spot")
            let emptySpots = getAllButWallFromMap(myState.map);
            let rSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            
            if(enemy[2].length == 0 || !enemy[1] || distance <= 5)
            {                
                console.log(difficulty)
                switch(difficulty)
                {
                    case 0:     
                        enemy[1] = [...rSpot]           
                        break;
                    case 1:
                        if(Math.random() > .5)
                        {
                            enemy[1] = [...myState.playerPos];
                        }
                        else
                        {
                            enemy[1] = [...rSpot]
                        }
                        break;
                        
                    case 2:
                        enemy[1] = [...myState.playerPos];
                }       
            }
            
        }      

        enemy[2] = [...AStar(enemy[0], enemy[1])];
        enemy[0] = enemy[2].shift();

        return enemy;
        
    }
    //[position, finalPosition, [nextPositions]]

    function AStar(_start, _end)
    {        
        let queue = [];  
        let nodeMap = new Map();
        myState.map.forEach((y, yIndex)=>y.forEach((x, xIndex)=> {if(myState.map[yIndex][xIndex] != 1)nodeMap.set([yIndex, xIndex].join(),new node([yIndex, xIndex],Infinity, Infinity, 2 * (Math.abs(_end[1] - xIndex) + Math.abs(_end[0] - yIndex)), undefined, undefined))}))     
        let end = nodeMap.get(_end.join());
        let start = nodeMap.get(_start.join());
        start.rootDistance = 0;
        if(_start.join() == _end.join())
        {
            //console.log(_start.join() + "   " + _end.join())
            let index = Math.floor(Math.random() * nodeMap.size);
            let i = 0;

            for(const m of nodeMap.values())
            {
                if( i == index)
                {
                    _end = m.position;
                    end = m;
                    break;
                }
                i++;

            }
            
        }
        //console.log(nodeMap)
        queue.unshift(start)
        while(!queue.length == 0)
        {
            let curNode = queue.pop();

            if(typeof(curNode) != 'object')
            {
                //console.log('stupid number' + curNode)
                continue;
            }

            curNode.discovered = true;
            let dirs = [[1,0],[0,1], [-1,0], [0,-1]];
            let unvisited_neighbors = [];
            dirs.forEach(d=>
                {
                    if(nodeMap.get([curNode.position[0] + d[0],curNode.position[1] + d[1]].join()))
                    {
                        if(!nodeMap.get([curNode.position[0] + d[0],curNode.position[1] + d[1]].join()).discovered)
                        {
                            unvisited_neighbors.push(nodeMap.get([curNode.position[0] + d[0],curNode.position[1] + d[1]].join()));
                        }
                    }                    
                }
            )

            for(let neighbor of unvisited_neighbors)
            { 
                //console.log(neighbor)
                neighbor.rootDistance = Math.min(neighbor.rootDistance, curNode.rootDistance + 1);
                const minDistance = Math.min(neighbor.distance, neighbor.rootDistance + neighbor.manhattanD);

                if(minDistance !== neighbor.distance)
                {
                    neighbor.distance = minDistance;
                    neighbor.parent = curNode;

                    if(!queue.includes(neighbor))
                    {
                        queue.unshift(neighbor)
                    }
                }                
                
            }
            
        }
        
       let nd = end;
       let nextPositions = [];
       while(nd.parent)
       {
           nextPositions.unshift(nd.position)
           nd = nd.parent;
       }
       
       return nextPositions;
        
    }

    function getPlayerPosFromMap(map)
    {
        
        for(let i = 0; i < map.length; i++)
        {
            for(let j = 0; j < map.length; j++)
            {
                if(map[j][i] == 2)
                {
                    return [j,i]
                }
            }
        }

        return null;
    }

    function getAllButWallFromMap(map)
    {
        let pos = [];
        for(let i = 0; i < map.length; i++)
        {
            for(let j = 0; j < map.length; j++)
            {
                if(map[j][i] != 1)
                {
                    pos.push([j,i]);
                }
            }
        }

        return pos;
    }

    function makeFruitOnMap(map)
    {
        let pos = [];
        for(let i = 0; i < map.length; i++)
        {
            for(let j = 0; j < map.length; j++)
            {
                if(map[j][i] == 0)
                {
                    pos.push([j,i]);
                }
            }
        }

        return pos;
    }

    function getFruitPosFromMap(map)
    {
        let pos = [];
        for(let i = 0; i < map.length; i++)
        {
            for(let j = 0; j < map.length; j++)
            {
                if(map[j][i] == 4)
                {
                    pos.push([j,i]);
                }
            }
        }

        return pos;
    }

    function getEnemyPosFromMap(map)
    {
        let pos = [];
        for(let i = 0; i < map.length; i++)
        {
            for(let j = 0; j < map.length; j++)
            {
                if(map[i][j] == 3)
                {
                    pos.push([[i,j],[], []]);
                }
            }
        }
        //console.log(pos)
        return pos;
    }
    //Goes Y first
    const maps = 
    [
        [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,1],
            [1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,3,0,1],
            [1,0,1,0,1,1,0,1,4,0,0,1,0,0,0,0,1,0,1,0,1,1,1],
            [1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,0,1],
            [1,0,1,1,0,1,3,1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,1],
            [1,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
            [1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1],
            [1,0,1,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,0,0,0,0,2,0,0,0,0,0,1,1,1,1,1],
            [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
            [1,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
    ]
    let map = maps[0];
    const [myState, setState] = useState({map : maps[0], playerPos : getPlayerPosFromMap(map), fruitPos : makeFruitOnMap(map), enemies : getEnemyPosFromMap(map)});
    const [playerDir, setPlayerDir] = useState([0,0])
    const [score, setScore] = useState(0)
    const [difficulty, setDifficulty] = useState(0)
    
    //Actually Setting state useEffect
    useEffect(() =>
    {
        const interval = setInterval(()=>
        {          
            
            //console.log(myState.fruitPos)
            let enemies = [...myState.enemies]
            let m2 = map.map(x=>x.map(y=>(y!=0 && y!=1)?y=0:y=y));
            myState.fruitPos.forEach(
                i=>m2[i[0]][i[1]] = 4
            )
            m2[myState.playerPos[0]][myState.playerPos[1]] = 2;
            let pd = myState.playerPos;

            let np = [playerDir[0] + pd[0],[playerDir[1] + pd[1]]];
            let ne = myState.map[np[0]][np[1]];
                        
            enemies.forEach(e=>
                {
                    let ep = [e[0][0],e[0][1]];
                    //console.log(ep)
                    m2[ep[0]][ep[1]] = 3
                })
            if(ne != 1)
            {
                pd[0]+= playerDir[0];
                pd[1]+= playerDir[1];
                if(ne == 4)
                {
                    setScore(score + 1);
                    m2[np[0]][np[1]] = 0;
                    myState.fruitPos = getFruitPosFromMap(m2);                       
                }
            }
            else
            {

            }       
            setState(prevState=>({...prevState,map:m2, playerPos:pd, fruitPos:myState.fruitPos, enemies:enemies}))

        }, 50);

        return () => clearInterval(interval)
    },[playerDir])

    //PlayerMovementEffect


    //EnemyMovementEffect
    useEffect(() =>
    {
        const interval = setInterval(()=>
        {
            let m2 = myState.map.map(x=>x.map(y=>(y!=0 && y!=1)?y=0:y=y));
            let enemies = [];
            myState.enemies.forEach(
                (e)=>
                {
                    let enp = getEnemyNextPos(e)
                    
                    if(enp)
                    {
                        e = enp; 
                    }
                    else
                    {
                        m2[e[0][0]][e[0][1]] = 3
                    }            
                    enemies.push(e)       
                }             

            )
            setState(prevState=>({...prevState,enemies:enemies}))
           
        }, 150)
        return () => clearInterval(interval)
    },[])
    
    const handleKeyPress = (event) => 
    {
        const key = event.key.toLowerCase();
        console.log(key)
        switch(key)
        {
           
            case 'w':
                setPlayerDir([-1,0])
                break;
            case 'a':
                setPlayerDir([0,-1])
                break;
            case 's':
                setPlayerDir([1,0])
                break;
            case 'd':
                setPlayerDir([0,1])
                break;
        }
    }

    const changeDiff = (e) =>
    {
        console.log(e.target.value)
        setDifficulty(parseInt(e.target.value))
        console.log(difficulty)
    }

    return (
        <div className = 'game' onKeyPress={(e)=>handleKeyPress(e)} tabIndex={0}>
            <GameMap myMap = {myState.map}/>
            
            <div>{score}</div>
            <select onChange= {(e)=>changeDiff(e)}>
                <option value = '0'>easy</option>
                <option value = '1'>Medium</option>
                <option value = '2'>Hard</option>
            </select>
        </div>
    )   



}


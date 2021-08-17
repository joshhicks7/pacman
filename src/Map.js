import React from 'react'
import './Map.css'

export default function GameMap({myMap}) 
{   

    return (
        <div className = 'Map' >
            {myMap.map((row, rn) =>            
                <div className = 'map_row' key = {'map_row_' + rn}>
                    {row.map((col,cn)=><div key = {'row_'+ rn + '_' + 'col' + '_' + cn}className = 'node'><div className = {getNameFromNumber(myMap[rn][cn])}></div></div>)} 
                </div>
            )}
        </div>
    )
}

function getNameFromNumber(num)
{

    let names = {0:'empty', 1:'border', 2:'pacman', 3:'enemy', 4:'fruit'}

    return names[num]
}
import React from "React";
import styled from "styled-components";

interface LocationProps {
    lat: number;
    lng:number;
}

const LocationTag: React.FC<LocationProps> = (props) =>{
     const API_key = "AIzaSyDr2MOTyBtCxIjhkAMJSfa-KwN6eBrkEhI";
     const {lng, lat} = props;
     
    const address = ()=>{
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_key}`)
    .then(res=>res.json())
    .then(data=>console.log(data.results[1].formatted_address))
    .then(data=>{return data.results[1].formatted_address});
}

fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_key}`)
    .then(res=>res.json())
    .then(data=>console.log(data.results[1].formatted_address))

    return (<p>{address()}</p>)

}

export default LocationTag;
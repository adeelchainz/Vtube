import React, {useEffect, useState} from 'react';
import Axios from 'axios';

function Subscriber(props) {

    const userTo = props.userTo
    const userFrom= props.userFrom

    const [SubscribeNumber, setSubcribeNumber]= useState(0)
    const [Subscribed, setSubscribed]= useState(false)

    const onSubscribe=()=>{

        let subs={
            userTo: userTo,
            userFrom:userFrom
        }

        if (Subscribed){

            Axios.post('/api/subscribe/unSubscribe', subs)
            .then(response=>{
            if(response.data.success){
                setSubcribeNumber(SubscribeNumber - 1)
                setSubscribed(!Subscribed)
            }else {
                alert('UnableToUnSubscribe')
            }
        })
        } else{

            Axios.post('/api/subscribe/subscribe', subs)
            .then(response=>{
            if(response.data.success){
                setSubcribeNumber(SubscribeNumber + 1)
                setSubscribed(!Subscribed)

            }else {
                alert('UnableToSubscribe')
            }
        })

        }
    }

    
    useEffect(()=>{

        const subscribeNo={userTo:userTo , userFrom: userFrom}

        Axios.post('/api/subscribe/subscribeNumber', subscribeNo)
        .then(response=>{
            if(response.data.success){
                setSubcribeNumber(response.data.subscribeNumber)
                console.log(response.data.subscribeNumber)
            }else {
                alert('Unavailable')
            }
        })

        Axios.post('/api/subscribe/subscribed', subscribeNo)
        .then(response=>{
            if(response.data.success){
                setSubscribed(response.data.subscribed)
                console.log(response.data.subscribed)
            }else {
                alert('Not working')
            }
        })

    },[])

    return (
        <div>
            <button
            onClick={onSubscribe}
             style={{
                backgroundColor: `${Subscribed? '#AAAAAA' :'#CC0000'}`, borderRadius:'4px', color:'white', padding:'10px 16px' ,
                fontWeight:'500', fontSize:'1rem' , textTransform:'uppercase'
            }}>
               {SubscribeNumber} {Subscribed? 'Subscribed':
               'Subscribe'} 
            </button>
        </div>
    );
}

export default Subscriber;
import React, { useEffect, useState } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { act } from '@testing-library/react';
import { NewReleasesTwoTone } from '@material-ui/icons';
import {parseISO} from 'date-fns';

export default function CalendarComponent({currentUser}) {

  const navigate = useNavigate();
  const notify = () => toast("Don't you worry, don't you worry, child \n See heaven's got a plan for you", {
    icon: '✈️',
  });

  const [events,setEvents] = useState([]);

  useEffect(() => {
    notify();
    axios.get('http://localhost:4000/event',  {
      headers: {
          'Authorization': 'Bearer ' + currentUser.token.access_token
      }
  })
      // .then(res => res.json())
      .then(data => {
        data.data.events.forEach(eve => {
          eve.start = parseISO(eve.start); 
          eve.end = parseISO(eve.end);        
        });
        setEvents(prevEvents => {
          return [...prevEvents,...data.data.events];
        });
      });
    
  }, []);

  console.log(events);

  const onConfirm = async (event,action) => {
    // console.log(action);
    if (action === "edit")
    {
      axios.patch(`http://localhost:4000/event/${event._id}`, event,  {
        headers: {
            'Authorization': 'Bearer ' + currentUser.token.access_token
        }
    });
      console.log(event);
    }
    else
    {
      var rex = axios.post('http://localhost:4000/event/', event,  {
        headers: {
            'Authorization': 'Bearer ' + currentUser.token.access_token
        }
    });

    }
    return new Promise((res,rej) => {res(event)})
  };

  const getId = (id) => {
    console.log(id);
  }

  return ( <>
    <Toaster
    position="top-center"
    reverseOrder={false}
  />
    <Scheduler
      onConfirm={onConfirm}
      view="week"
      events={events}
      selectedDate={new Date()}
      />
    </>
  );
}
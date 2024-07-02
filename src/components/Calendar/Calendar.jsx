import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { addReservation, getReservations, updateReservation } from '../model/calendarService'; // Importa la función updateReservation

const resources = [
  { id: '1', title: 'Recurso 1', color: '#ff5733' }, // Rojo
  { id: '2', title: 'Recurso 2', color: '#33ff57' }, // Verde
  { id: '3', title: 'Recurso 3', color: '#3357ff' }  // Azul
];

const options = ['Opción A', 'Opción B', 'Opción C', 'Otros'];

const Calendario = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservations = await getReservations();
      setEvents(reservations);
    };

    fetchReservations();
  }, []);

  const handleDateSelect = async (selectInfo) => {
    const title = prompt('Please enter a new title for your event');
    if (!title) {
      return;
    }

    const resourceId = prompt('Please enter the resource ID (1, 2, 3)');
    const resource = resources.find(r => r.id === resourceId);

    if (!resource) {
      alert('Invalid resource ID');
      return;
    }

    let selectedOption = prompt('Please select an option (A, B, C) or type "Otros" to enter manually');
    if (selectedOption === 'Otros') {
      selectedOption = prompt('Please enter your option');
    } else if (!options.includes(`Opción ${selectedOption}`)) {
      alert('Invalid option');
      return;
    }

    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    const newEvent = {
      title: `${title} (${selectedOption})`,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      resourceId: resource.id,
      allDay: selectInfo.allDay,
      color: resource.color // Asigna el color basado en el recurso
    };

    try {
      await addReservation(newEvent);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (e) {
      console.error('Error adding event: ', e);
    }
  };

  const handleEventClick = async (clickInfo) => {
    const title = prompt('Edit event title:', clickInfo.event.title);
    if (!title) {
      return;
    }

    const resourceId = prompt('Edit resource ID (1, 2, 3):', clickInfo.event.extendedProps.resourceId);
    const resource = resources.find(r => r.id === resourceId);

    if (!resource) {
      alert('Invalid resource ID');
      return;
    }

    let selectedOption = prompt('Edit option (A, B, C) or type "Otros" to enter manually:', clickInfo.event.title.split('(')[1]?.split(')')[0]);
    if (selectedOption === 'Otros') {
      selectedOption = prompt('Please enter your option');
    } else if (!options.includes(`Opción ${selectedOption}`)) {
      alert('Invalid option');
      return;
    }

    const newEndTime = prompt('Edit end time (YYYY-MM-DDTHH:MM:SS):', clickInfo.event.endStr);
    if (!newEndTime) {
      return;
    }

    const updatedEvent = {
      ...clickInfo.event.extendedProps,
      id: clickInfo.event.id,
      title: `${title} (${selectedOption})`,
      start: clickInfo.event.startStr,
      end: newEndTime,
      resourceId: resource.id,
      allDay: clickInfo.event.allDay,
      color: resource.color
    };

    clickInfo.event.setProp('title', updatedEvent.title);
    clickInfo.event.setDates(updatedEvent.start, updatedEvent.end);
    clickInfo.event.setExtendedProp('resourceId', updatedEvent.resourceId);
    clickInfo.event.setProp('backgroundColor', updatedEvent.color);
    clickInfo.event.setProp('borderColor', updatedEvent.color);

    try {
      await updateReservation(updatedEvent); // Llama a la función para actualizar el evento en Firestore
    } catch (e) {
      console.error('Error updating event: ', e);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, resourceTimelinePlugin, interactionPlugin]}
      initialView="timeGridWeek"
      selectable={true}
      select={handleDateSelect}
      events={events}
      resources={resources}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      eventContent={(eventInfo) => (
        <div style={{ backgroundColor: eventInfo.event.extendedProps.color }}>
          <b>{eventInfo.timeText}</b>
          <i>{eventInfo.event.title}</i>
        </div>
      )}
      eventClick={handleEventClick}
    />
  );
};

export default Calendario;

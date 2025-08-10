document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    // Load from Firebase
    events: function (fetchInfo, successCallback, failureCallback) {
      fetch(`${firebaseUrl}/events.json`)
        .then(response => response.json())
        .then(data => {
          if (!data) return successCallback([]);
          const events = Object.entries(data).map(([id, event]) => ({
            id,
            title: event.title,
            start: event.start,
            end: event.end
          }));
          successCallback(events);
        });
    },

    // Create Event
    select: function (info) {
      const title = prompt('Enter Event Title:');
      if (title) {
        const newEvent = {
          title,
          start: info.startStr,
          end: info.endStr
        };

        fetch(`${firebaseUrl}/events.json`, {
          method: 'POST',
          body: JSON.stringify(newEvent),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
          calendar.addEvent({
            id: data.name,
            ...newEvent
          });
        });
      }
      calendar.unselect();
    },

    // Delete Event on Click
    eventClick: function (info) {
      if (confirm(`Delete event "${info.event.title}"?`)) {
        const id = info.event.id;
        fetch(`${firebaseUrl}/events/${id}.json`, {
          method: 'DELETE'
        }).then(() => {
          info.event.remove();
        });
      }
    },

    // Update on Drag or Resize
    eventDrop: updateEvent,
    eventResize: updateEvent
  });

  calendar.render();

  function updateEvent(info) {
    const updated = {
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end?.toISOString() || info.event.start.toISOString()
    };

    fetch(`${firebaseUrl}/events/${info.event.id}.json`, {
      method: 'PUT',
      body: JSON.stringify(updated),
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

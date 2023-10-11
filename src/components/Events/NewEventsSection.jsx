import { useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', { max: 3 }], // key to store cached events after first fetch and restrict on fetching only 3 events
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }), // our fetch function
    staleTime: 5000, // the time at which the event should be stale before fetching new data. Even if the new request comes up, it will be staled till the time does not exhausts.
    // gcTime: 1000, // the time at which the query will delete the cached events and send new request to update the cached events. However if it is less than staleTime, when user come to the page again withing the staleTime but after the gcTime, page will not show any data as it has deleted the cached data and next request will only be sent after the stale time.
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || 'Failed to  fetch events'}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

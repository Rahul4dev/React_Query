import {
  Link,
  redirect,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import EventForm from './EventForm.jsx';
import Modal from '../UI/Modal.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { fetchSingleEvent, queryClient, updateEvent } from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useNavigation();
  const submit = useSubmit();

  const { data, isError, error } = useQuery({
    queryKey: ['events', { id: params.id }],
    queryFn: ({ signal }) => fetchSingleEvent({ signal, id: params.id }),
    staleTime: 10000,
  });

  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="An error has occurred"
          message={error.info?.message || 'Failed to load the event'}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  // const { mutate } = useMutation({
  //   mutationFn: ({ event }) => updateEvent({ id: params.id, event: event }),
  //   useMutate: async (data) => {
  //     //*Step:9 Optimistic Update:  useMutate will be executed right after the mutate function to get the fallback. Here we can store that data which can be stored as a fallback of failed mutation. Then it will be showed later. Just like cached data. Hence it will manipulate the data without waiting for response.
  //     const newEvent = data.event;

  //     //* however we have to cancel other ongoing queries before manipulating the data.
  //     await queryClient.cancelQueries({ queryKey: ['events', params.id] });
  //     //* we can get previous data from getQueryData
  //     const previousEvent = queryClient.getQueryData(['events', params.id]);
  //     //* Now we want to rollback to previous data is our mutation function fails.
  //     queryClient.setQueryData(['events', params.id], newEvent);
  //     //* return the context to onError so that we can rollback.
  //     return { previousEvent };
  //   },

  //   onError: (error, data, context) => {
  //     queryClient.setQueryData(['events', params.id], context.previousEvent);
  //   },

  //   onSettled: () => {
  //     queryClient.invalidateQueries(['events', params.id]);
  //   },
  //   // onSuccess: () => {
  //   //   queryClient.invalidateQueries({ queryKey: ['events'] });
  //   // },
  // });

  function handleSubmit(formData) {
    submit(formData, { method: 'PUT' });
    // mutate({ id: params.id, event: formData });
    // navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (
          <p>Sending data...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }
  return <Modal onClose={handleClose}>{content}</Modal>;
}
// New Approach: Since useQuery used to fetch the data for the component. We can also fetch the data using fetchQuery using queryClient of the react-router-dom and give it to the component right away when it loads, ie, in App.js file route parameters. You can see this export will be used in app.jsx file to provide the loader of the editEvent route. Hence through this approach, we can give the required data before the page loads. and with the same queryKey it can fetch the data from the cache later using useQuery. It will optimize the speed of the rendering of the component.
// eslint-disable-next-line react-refresh/only-export-components
export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchSingleEvent({ signal, id: params.id }),
  });
}

//* Similarly, we can export an action function to the app.jsx file route parameters instead of using useMutation hook, and provide the required data after updating the form. We can use useSubmit hook to submit the formData using PUT method. We are not submitting the form but the useSubmit will execute the action function in the client side environment.
// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updatedEventData });

  await queryClient.invalidateQueries(['events']);
  return redirect('../');
}

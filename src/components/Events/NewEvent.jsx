import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent, queryClient } from '../../util/http.js';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  // Step: 4, since useMutation hook used for mutations in the database where we send some data to the server and get some response. Here also we can use useQuery for the sending request but it useMutation hook is optimized for data changing queries and we want to control the sending of requests whenever we want, which is given by the useMutation hook, not by the useQuery hook. However it also send similar response object except mutate function/method instead of data object. Mutate will be used to collect the data to send as post request, and in the configuration settings, mutationFn will used to send the POST request to the server. Here createNewEvent is the function we point, used for the logic of sending the post request.

  // Step: 5, however, after submitting/ mutation success, we want to navigate to the events page. This logic is generally  placed in the handleSubmit function, but here we do not do this as it will navigate to the events page and we do not get the response of the post request. We do not want to navigate until the post request succeeds. For that we have to place our navigation logic inside the onSuccess function of the useMutation hook configuration, which is used to run the logic after the successful request.

  // Step: 6, one more thing we have to do after the mutation success, we need to show that data on the events page. Since as we redirect to the events page we want to rerender the events. However ReactQuery give us another method to get the data to invalidate it before the navigation. For that we have to use QueryClient object of the react-query used as a client for the queryClientProvider to propagate the query parameter to the application. Step 7 will be in the util's http function where we export the queryClient so that we can use it in multiple places eg., in App.jsx and in this file.

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchTypes: 'none',
      });
      navigate('/events');
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            'Failed to crate event. Please check your inputs and try again later.'
          }
        />
      )}
    </Modal>
  );
}

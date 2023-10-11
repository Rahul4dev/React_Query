// In this file, we have to incorporate the image upload functionality where we can send a get request to our backend and give the list of images we can display and handle the selection of image for the event. Here we have ImagePicker component which will do this for us. We have the backend code for get request at /events/images in app.js where it will send the response as a image array which eventually be shown by the ImagePicker and give the options to choose the image for the event. But we have to use the ReactQuery to send the get request.

import { useState } from 'react';
// Steps: 1. import useQuery hook from react-query and our fetchSelectableImages function form util's http file
import { useQuery } from '@tanstack/react-query';
import { fetchSelectableImages } from '../../util/http.js';

import ImagePicker from '../ImagePicker.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventForm({ inputData, onSubmit, children }) {
  const [selectedImage, setSelectedImage] = useState(inputData?.image);

  // step: 2. use the hook and configure it by the function.
  const { data, isPending, isError } = useQuery({
    queryKey: ['events-images'],
    queryFn: fetchSelectableImages,
  });

  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    onSubmit({ ...data, image: selectedImage });
  }

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ''}
        />
      </p>
      {/* // Step: 3. Use the response object of the Hook, like data will go to imagePicker to show the available images, isPending and isError will be used for the other cases  *Step 4 will be in the newEvent component where we bring logic for the navigation after submitting the form */}
      {isPending && <p>Loading selectable images...</p>}
      {isError && (
        <ErrorBlock
          title="Failed to load selectable images"
          message="Please try later."
        />
      )}

      {data && (
        <div className="control">
          <ImagePicker
            images={data}
            onSelect={handleSelectImage}
            selectedImage={selectedImage}
          />
        </div>
      )}

      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={inputData?.description ?? ''}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={inputData?.date ?? ''}
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={inputData?.time ?? ''}
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={inputData?.location ?? ''}
        />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}

import {
  Button,
  Card,
  Heading1,
  InlineLink,
  Input,
  LabelText,
  Text,
} from '@algolia/ui-library';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import React, { useState } from 'react';

function ApplyForm() {
  const { withBaseUrl } = useBaseUrlUtils();
  const [status, setStatus] = useState('stalled');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');

  const handleSetUrl = (event) => {
    setUrl(event.target.value);
  };
  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();

    if (status === 'loading') {
      return;
    }

    setStatus('loading');

    const applyForm = event.target;
    const method = applyForm.getAttribute('method');
    const action = applyForm.getAttribute('action');
    const formData = new FormData(applyForm);
    const data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });
    const body = JSON.stringify(data);

    fetch(action, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (!success) {
          return setStatus('failed');
        }

        if (message === 'You already have a pending request.') {
          return setStatus('duplicate');
        }

        return setStatus('succeed');
      })
      .catch(() => setStatus('failed'));
  };

  if (status === 'succeed' || status === 'duplicate') {
    return (
      <Card className="uil-m-auto uil-ta-center apply-form">
        <Heading1 className="apply-text">Thank you!</Heading1>
        <br />

        <Text
          className="uil-pv-8 uil-d-block apply-text"
          aria-label="Request will be processed"
        >
          {status === 'succeed'
            ? 'Your request will be processed by our team.'
            : 'Your request have already been received by our team and is being processed.'}{' '}
          We'll get back to you at <strong>{email}</strong> with the snippet
          you'll need to integrate into{' '}
          <InlineLink href={url}>{url}</InlineLink>.
        </Text>

        <Text aria-label="recommendations" className="apply-text">
          Please be patient, in the meantime, you can implement{' '}
          <InlineLink href={withBaseUrl('docs/tips')}>
            our recommendations for building a great DocSearch experience.
          </InlineLink>
        </Text>
      </Card>
    );
  }

  return (
    <Card className="uil-m-auto apply-form uil-pb-24">
      <form
        id="form-apply-docsearch"
        method="POST"
        action="https://docsearch-hub.herokuapp.com/form/inbound"
        onSubmit={onSubmit}
      >
        <LabelText key="url" tag="label" htmlFor="url" className="apply-text">
          Documentation or Blog URL
          <Input
            required={true}
            id="url"
            type="url"
            name="url"
            aria-label="URL of the open-source blog or documentation website"
            value={url}
            placeholder="https://project.org/docs"
            onChange={handleSetUrl}
          />
        </LabelText>

        <Text small={true} className="uil-pv-8 uil-d-block apply-text">
          We'll scrape pages at this address and index the content on Algolia.
        </Text>

        <LabelText
          tag="label"
          htmlFor="email"
          key="email"
          className="apply-text"
        >
          Email
          <Input
            required={true}
            id="email"
            type="email"
            name="email"
            aria-label="Email address of the owner of this website"
            value={email}
            placeholder="you@project.org"
            onChange={handleSetEmail}
          />
        </LabelText>

        <Text small={true} className="uil-pv-8 uil-d-block apply-text">
          We'll send you the snippet you'll have to integrate into your website
          and grant access to your Algolia application.
        </Text>

        <div className="uil-ph-32 uil-d-flex uil-fxd-column">
          <LabelText
            className="uil-pt-12 apply-text"
            tag="label"
            htmlFor="public"
            key="public"
          >
            <input
              required={true}
              id="public"
              name="public"
              aria-label="Confirm my website is publicly available"
              type="checkbox"
              className="uil-mr-8"
            />
            My website is publicly available
          </LabelText>

          <LabelText
            className="uil-pt-12 apply-text"
            tag="label"
            htmlFor="opensource"
            key="opensource"
          >
            <input
              required={true}
              id="opensource"
              name="opensource"
              aria-label="Confirm my website is an technical documentation of an open-source project or technical blog"
              type="checkbox"
              className="uil-mr-8"
            />
            My website is a technical documentation of an open-source project or
            a technical blog
          </LabelText>

          <LabelText
            className="uil-pt-12 apply-text"
            tag="label"
            htmlFor="owner"
            key="owner"
          >
            <input
              required={true}
              id="owner"
              name="owner"
              aria-label="Confirm I am owner of the website"
              type="checkbox"
              className="uil-mr-8"
            />
            I'm the owner of the website and I have{' '}
            <InlineLink href={withBaseUrl('docs/who-can-apply')}>
              read the checklist
            </InlineLink>
          </LabelText>

          <Button
            primary={true}
            disabled={status === 'loading'}
            className="uil-mt-16 uil-mb-16"
            tag="button"
            type="submit"
            id="joinButton"
          >
            Join the program
          </Button>
        </div>

        <Text small={true} className="uil-ta-center">
          <InlineLink href="https://www.algolia.com/policies/terms">
            Refer to Algolia's Privacy Policy for more information on how we use
            and protect your data
          </InlineLink>
        </Text>
      </form>
    </Card>
  );
}

export default ApplyForm;

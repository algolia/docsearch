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
  const [state, setState] = useState({ status: 'stalled', message: '' });
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [repo, setRepo] = useState('');

  const handleSetUrl = (event) => {
    setUrl(event.target.value);
  };
  const handleSetEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleSetRepo = (event) => {
    setRepo(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();

    if (state.status === 'loading') {
      return;
    }

    setState({ status: 'loading' });

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
          return setState({
            status: 'failed',
            message: 'Unable to submit your request.',
          });
        }

        return setState({ status: 'succeed', message });
      })
      .catch(() =>
        setState({
          status: 'failed',
          message: 'Unable to submit your request.',
        })
      );
  };

  if (state.status === 'succeed' && state.message) {
    return (
      <Card className="uil-m-auto uil-ta-center apply-form">
        <Heading1 className="apply-text">Thank you!</Heading1>
        <br />

        {state.message.startsWith('Your DocSearch') ? (
          <Text
            className="uil-pv-8 uil-d-block apply-text"
            aria-label="Request has already been processed"
          >
            {state.message}
          </Text>
        ) : (
          <>
            <Text
              className="uil-pv-8 uil-d-block apply-text"
              aria-label="Request will be processed"
            >
              {state.message} We'll get back to you at <strong>{email}</strong>{' '}
              with the snippet you'll need to integrate into{' '}
              <InlineLink href={url}>{url}</InlineLink>.
            </Text>

            <Text aria-label="recommendations" className="apply-text">
              Please be patient, in the meantime, you can implement{' '}
              <InlineLink href={withBaseUrl('docs/tips')}>
                our recommendations for building a great DocSearch experience.
              </InlineLink>
            </Text>
          </>
        )}
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

        <LabelText
          tag="label"
          htmlFor="repoURL"
          key="repoURL"
          className="apply-text"
        >
          Repository URL
          <Input
            required={true}
            id="repoURL"
            type="url"
            name="repoURL"
            aria-label="The URL of your project repository"
            value={repo}
            placeholder="https://github.com/algolia/docsearch, https://gitlab.com/gitlab-org/gitlab, etc..."
            onChange={handleSetRepo}
          />
        </LabelText>

        <Text small={true} className="uil-pv-8 uil-d-block apply-text">
          We will use this link to determine if your project is open-source.
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
              aria-label="Confirm my website is a publicly available developer documentation or a technical blog."
              type="checkbox"
              className="uil-mr-8"
            />
            My website is a publicly available developer documentation or a
            technical blog.
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
              aria-label="Confirm I am the owner of the website, or otherwise have obtained and
              continue to maintain any required consents necessary to use
              DocSearch on the requested domain. And I have read the checklist."
              type="checkbox"
              className="uil-mr-8"
            />
            I am the owner of the website, or otherwise have obtained and
            continue to maintain any required consents necessary to use
            DocSearch on the requested domain. And I have{' '}
            <InlineLink href={withBaseUrl('docs/who-can-apply')}>
              read the checklist.
            </InlineLink>
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
              aria-label="Confirm I understand that this is a Free Service as described in Algolia's Terms of Service"
              type="checkbox"
              className="uil-mr-8"
            />
            I understand that this is a Free Service as described in Algolia's{' '}
            <InlineLink href="https://www.algolia.com/policies/terms/">
              Terms of Service.
            </InlineLink>
          </LabelText>

          <Button
            primary={true}
            disabled={state.status === 'loading'}
            className="uil-mt-16 uil-mb-16"
            tag="button"
            type="submit"
            id="joinButton"
          >
            Join the program
          </Button>
        </div>

        <Text small={true} className="uil-ta-center">
          <InlineLink href="https://www.algolia.com/policies/privacy/">
            Refer to Algolia's Privacy Policy for more information on how we use
            and protect your data
          </InlineLink>
        </Text>

        <Text small={true} className="uil-ta-center">
          <strong>
            Only apply if you don't have a DocSearch application yet. <br />
            For support requests, make sure to first{' '}
            <InlineLink href="/docs/DocSearch-program#support">
              read our policy
            </InlineLink>
            .
          </strong>{' '}
        </Text>
      </form>
    </Card>
  );
}

export default ApplyForm;

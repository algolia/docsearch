import {
  Card,
  Input,
  LabelText,
  Text,
  Button,
  InlineLink,
} from '@algolia/ui-library';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import useThemeContext from '@theme/hooks/useThemeContext';
import React, { useState } from 'react';

function ApplyForm() {
  const { withBaseUrl } = useBaseUrlUtils();
  const theme = useThemeContext.isDarkTheme ? 'dark' : 'light';
  const [hasSent, setHasSent] = useState(false);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');

  function onSubmit(event) {
    event.preventDefault();

    const applyForm = event.target;
    const method = applyForm.getAttribute('method');
    const url = applyForm.getAttribute('action');
    const formData = new FormData(applyForm);
    const data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });
    const body = JSON.stringify(data);

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    }).then((response) => {
      if (response.ok) {
        setHasSent(true);
      }
    });
  }

  if (hasSent) {
    return (
      <Card background={theme} className="uil-m-auto" style={{ maxWidth: 600 }}>
        <LabelText style={{ fontSize: '1.2em' }}>Thank you!</LabelText>
        <br />

        <Text
          small
          className="uil-pv-8 uil-d-block"
          aria-label="Request will be processed"
        >
          Your request will be processed by our team. We'll get back to you at{' '}
          {email} with the JavaScript snippet you'll need to integrate into{' '}
          <InlineLink href={url}>{url}</InlineLink>.
        </Text>

        <Text aria-label="recommendations">
          Please be patient, in the meantime, you can implement{' '}
          <InlineLink href={withBaseUrl('/docs/tips')}>
            our recommendations for building a great DocSearch experience.
          </InlineLink>
        </Text>
      </Card>
    );
  }

  return (
    <Card background={theme} className="uil-m-auto" style={{ maxWidth: 600 }}>
      <form
        onSubmit={onSubmit}
        id="form-apply-docsearch"
        method="POST"
        action="https://docsearch-hub.herokuapp.com/form/inbound"
      >
        <LabelText key="url" tag="label" htmlFor="url">
          Documentation URL
          <Input
            id="url"
            type="url"
            name="url"
            aria-label="URL of the documentation website"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://project.org/docs"
            required
          />
        </LabelText>

        <Text small className="uil-pv-8 uil-d-block">
          We'll scrape pages at this address and index the content on Algolia.
        </Text>

        <LabelText tag="label" htmlFor="email" key="email">
          Email
          <Input
            id="email"
            type="email"
            name="email"
            aria-label="Email address of the owner of this website"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@project.org"
            required
          />
        </LabelText>

        <Text small className="uil-pv-8 uil-d-block">
          We'll send you the JavaScript snippet you'll have to integrate into
          your documentation.
        </Text>

        <div className="uil-ph-32 uil-ta-center uil-d-flex uil-fxd-column">
          <LabelText tag="label" htmlFor="owner" key="owner">
            <input
              id="owner"
              name="owner"
              aria-label="Confirm I am owner of the website"
              type="checkbox"
              className="uil-mr-8"
              required
            />
            I'm the owner of the website and I have{' '}
            <InlineLink href={withBaseUrl('/docs/who-can-apply')}>
              read the checklist
            </InlineLink>
          </LabelText>

          <Button
            className="uil-mt-16 uil-mb-16"
            tag="button"
            type="submit"
            id="joinButton"
            primary
          >
            Join the program
          </Button>
        </div>

        <Text className="uil-ta-center" small>
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

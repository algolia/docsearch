import React from "react";
import {
  Card,
  Input,
  LabelText,
  Text,
  Button,
  InlineLink
} from "@algolia/ui-library";

const MAX_WIDTH = "600px";
export default class ApplyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { url: "", email: "", freeze: false };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleURLChange(event) {
    this.setState({ url: event.target.value });
  }
  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const applyForm = event.target;
    const method = applyForm.getAttribute("method");
    const url = applyForm.getAttribute("action");
    const formData = new FormData(applyForm);

    fetch(url, {
      method: method,
      mode: "no-cors",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: formData
    }).then(response => {
      if (response.ok) {
        this.setState({ freeze: true });
      }
    });
  }

  render() {
    if (!this.state.freeze) {
      return (
        <Card style={{ maxWidth: MAX_WIDTH, margin: "auto" }}>
          <form
            onSubmit={this.handleSubmit}
            id="form-apply-docsearch"
            method="POST"
            action="www.algolia.com/docsearch/join"
          >
            <LabelText key="url" style={{ fontSize: "1.2em" }}>
              DOCUMENTATION URL:
            </LabelText>
            <Input
              type="url"
              name="url"
              aria-label="URL of the documentation website"
              value={this.state.url}
              onChange={this.handleURLChange}
              style={{ margin: "1em 0em" }}
              placeholder={"https://project.org/docs"}
              required
            />
            <Text>
              We'll crawl pages at this address and index the content on Algolia
            </Text>
            <LabelText key="email" style={{ fontSize: "1.2em" }}>
              EMAIL:
            </LabelText>

            <Input
              type="email"
              name="email"
              aria-label="Email address of the owner of this website"
              value={this.state.email}
              onChange={this.handleEmailChange}
              style={{ margin: "1em 0em" }}
              placeholder={"you@project.org"}
              required
            />
            <LabelText tag="label" htmlFor="owner" key="owner">
              <input
                id="owner"
                name="owner"
                aria-label="Confirm I am owner of the website"
                type="checkbox"
                required
              />
              I'm the owner of the website and I've{" "}
              <InlineLink href="./who-can-apply.html">
                read the checklist
              </InlineLink>
            </LabelText>
            <Text style={{ margin: "1em 0em 0em" }}>
              We'll send you the JavaScript snippet you'll have to integrate
              into your documentation
            </Text>
            <button
              type="submit"
              form="form-apply-docsearch"
              value="Submit"
              style={{
                borderColor: "transparent",
                background: "none",
                width: "100%",
                margin: "1.5em 0em"
              }}
              aria-describedby="joinButton"
            >
              <Button id="joinButton" primary>
                Join the program
              </Button>
            </button>
            <InlineLink href="https://www.algolia.com/policies/terms" small>
              Refer to Algolia's Privacy Policy for more information on how we
              use and protect your data
            </InlineLink>
          </form>
        </Card>
      );
    } else {
      return (
        <Card style={{ maxWidth: MAX_WIDTH, margin: "auto" }}>
          <LabelText style={{ fontSize: "1.2em" }}>Thank you!</LabelText>
          <br />
          <Text
            style={{ marginTop: "1em" }}
            aria-label="Request will be processed"
          >
            Your request will be processed by our team. We'll get back to you on{" "}
            {this.state.email} with the snippet of JavaScript you'll need to
            integrate into
            <InlineLink href={this.state.url}> {this.state.url}</InlineLink> .
          </Text>
          <Text aria-label="recommendations">
            Please be patient, in the meantime, you can implement{" "}
            <InlineLink href="/tips.html">
              our recommendations for the best experience with DocSearch.
            </InlineLink>
          </Text>
        </Card>
      );
    }
  }
}

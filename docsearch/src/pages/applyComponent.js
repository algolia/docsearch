import React from "react";
import {
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
    fetch("https://www.algolia.com/docsearch/join", {
      method: "POST",
      headers: {
        'Access-Control-Allow-Origin':'*',
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: this.state.url,
        email: this.state.email
      })
    });
    event.preventDefault();
    this.setState({ freeze: true });
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        id="form"
        style={{ maxWidth: MAX_WIDTH, margin: "auto" }}
        target="formSending"
        disabled={this.setState.freeze}
      >
        <LabelText style={{ fontSize: "1.2em" }}>
          DOCUMENTATION URL:
          <Input
            type="url"
            name="url"
            value={this.state.url}
            onChange={this.handleURLChange}
            placeholder={"https://project.org/docs"}
            required
          />
          <Text style={{ fontSize: "0.6em" }}>
            We'll crawl pages at this address and index the content on Algolia
          </Text>
        </LabelText>
        <LabelText style={{ fontSize: "1.2em" }}>
          EMAIL:
          <Input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
            placeholder={"you@project.orgs"}
            required
          />
          <Text style={{ fontSize: "0.6em" }}>
            We'll send you the JavaScript snippet you'll have to integrate into
            your documentation
          </Text>
        </LabelText>
        <button
          type="submit"
          form="form"
          value="Submit"
          style={{
            "border-color": "transparent",
            background: "none",
            width: "100%"
          }}
        >
          <Button primary>Join the program</Button>
        </button>

        <Text style={{ marginTop: "1em" }}>
          <InlineLink href="https://www.algolia.com/policies/terms">
            Refer to Algolia's Privacy Policy for more information on how we use
            and protect your data
          </InlineLink>
        </Text>
      </form>
    );
  }
}

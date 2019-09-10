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
    fetch("https://www.algolia.com/docsearch/join", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
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
    if (!this.state.freeze) {
      return (
        <Card style={{ maxWidth: MAX_WIDTH, margin: "auto" }}>
          <form
            onSubmit={this.handleSubmit}
            id="form"
            style={{ maxWidth: MAX_WIDTH, margin: "auto" }}
          >
            <LabelText style={{ fontSize: "1.2em" }}>
              DOCUMENTATION URL:
            </LabelText>
            <Input
              type="url"
              name="url"
              value={this.state.url}
              onChange={this.handleURLChange}
              style={{ margin: "1em 0em" }}
              placeholder={"https://project.org/docs"}
              required
            />
            <Text>
              We'll crawl pages at this address and index the content on Algolia
            </Text>
            <LabelText style={{ fontSize: "1.2em" }}>EMAIL:</LabelText>

            <Input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              style={{ margin: "1em 0em" }}
              placeholder={"you@project.orgs"}
              required
            />
            <Text>
              We'll send you the JavaScript snippet you'll have to integrate
              into your documentation
            </Text>
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
                Refer to Algolia's Privacy Policy for more information on how we
                use and protect your data
              </InlineLink>
            </Text>
          </form>
        </Card>
      );
    } else {
      return (
        <Card style={{ maxWidth: MAX_WIDTH, margin: "auto" }}>
          <LabelText style={{ fontSize: "1.2em" }}>Thank you!</LabelText>
          <br />
          <Text style={{ marginTop: "1em" }}>
            Your request will be processed by our team. We'll get back to you on{" "}
            {this.state.email} with the snippet of JavaScript you'll need to
            integrate into 
            <InlineLink href={this.state.url}> {this.state.url}</InlineLink> .
          </Text>
          <Text>
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

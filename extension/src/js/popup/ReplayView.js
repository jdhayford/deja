import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ViewPort = styled.div`
  margin: 1rem auto 0;
`;

export class ReplayView extends React.Component {
  render() {
    const { source } = this.props;
    return (
      <ViewPort>
        <video loop autoPlay muted width="300">
          <source src={source} type="video/mp4" />
          Sorry, your browser doesn&apos;t support embedded videos.
        </video>
      </ViewPort>
    );
  }
}

ReplayView.propTypes = {
  source: PropTypes.string.isRequired,
};
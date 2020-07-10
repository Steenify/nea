import React, { Component } from 'react';
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg';
import { getEmailGroupsLOV } from 'services/sample-identification';

// import './style.scss';

class CertificationTab extends Component {
  constructor(props) {
    super(props);
    const { detail } = props;
    this.state = {
      certification: detail?.certification,
      isEmailChecked: false,
      selectedEmailGroup: [],
      filteredEmailGroups: [],
      emailGroupLOV: [],
    };
  }

  async componentDidMount() {
    const { isSubmitted } = this.props;
    if (!isSubmitted) {
      const statusResponse = await getEmailGroupsLOV();
      const emailGroupLOV = statusResponse.status === 200 ? statusResponse.data : [];

      this.setState({
        emailGroupLOV,
        filteredEmailGroups: emailGroupLOV,
      });
    }
  }

  toggleEmail = () => {
    this.setState((prevState) => ({
      isEmailChecked: !prevState.isEmailChecked,
    }));
  };

  onSelectEmailGroup = (group) => {
    const { selectedEmailGroup } = this.state;
    const temp = selectedEmailGroup;
    const index = temp.indexOf(group);
    if (index >= 0) {
      temp.splice(index, 1);
    } else {
      temp.push(group);
    }
    this.setState({
      selectedEmailGroup: temp,
    });
  };

  onSearchEmail = (event) => {
    const { emailGroupLOV } = this.state;
    const text = event.target.value.toLocaleLowerCase();
    const emailGroups = emailGroupLOV.filter((group) => group.configGroup.toLocaleLowerCase().includes(text) || group.userNameList.toLocaleLowerCase().includes(text));
    this.setState({
      filteredEmailGroups: emailGroups,
    });
  };

  getCertifyFindingsInfo = () => {
    const { isEmailChecked, selectedEmailGroup } = this.state;
    return { isEmailChecked, selectedEmailGroup };
  };

  render() {
    const { isEmailChecked, selectedEmailGroup, filteredEmailGroups } = this.state;
    const { detail, isSubmitted } = this.props;
    const certifiedByName = detail?.certification?.certifiedByName || detail?.info?.collectorName;
    const certifiedByDesignation = detail?.certification?.certifiedByDesignation || detail?.info?.collectorDesignation;
    const certifiedDate = detail?.certification?.certifiedDate;
    // const update = detail ? detail.certifiedByName || null : null;
    const emailGroups = detail?.certification?.emailGroups || [];

    if (isSubmitted) {
      return (
        <div>
          <div className="tab-pane__group bg-white">
            <div className="card ">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="label-group mb-4">
                      <p className="col-form-label">The specimen(s) and results of the findings as indicated in the Analysis section are certified on {certifiedDate}.</p>
                    </div>
                  </div>
                </div>
                {emailGroups.length > 0 && (
                  <div className="row">
                    <div className="col-md-2 col-xl-1">
                      <div className="nea-chkbx form-group">
                        <label className="custom-chckbbox">Email:</label>
                      </div>
                    </div>
                    <div className="col-md-6 col-xl-6">
                      {emailGroups.map((item, index) => (
                        <label className="email-groups mr-2 bg-light-blue" key={`certified_emails_${index.toString()}`}>
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="row mt-5">
                  <div className="col-md-12 justify-content-end">
                    <div className="label-group" style={{ textAlign: 'right' }}>
                      <p className="bold-text mb-0">
                        {certifiedByName} ({certifiedByDesignation})
                      </p>
                      <p className="small-grey-text mb-0">Name/Designation of Analyst Appointed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="tab-pane__group bg-white">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="label-group">
                    <p className="col-form-label">I hereby certify that I have examined the specimen(s) and the results of my findings are as indicated in the "Analysis" section.</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2 col-xl-1">
                  <div className="nea-chkbx form-group">
                    <label className="custom-chckbbox">
                      Email
                      <input className={`form-control ${isEmailChecked ? 'checked' : ''}`} type="checkbox" checked={isEmailChecked} onChange={this.toggleEmail} />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
                <div className="col-md-4 col-xl-3">
                  <div className={`searchToken ${isEmailChecked ? 'show' : ''}`}>
                    <div className="searchWrapper">
                      <input type="text" className="searchTextfield" placeholder="Enter" disabled={!isEmailChecked} onChange={this.onSearchEmail} />
                      <SearchIcon className="searchIcon" />
                    </div>
                    <div className="chkboxCont">
                      {isEmailChecked &&
                        filteredEmailGroups.map((group, i) => (
                          <div className="custom-control custom-checkbox marginBottom15" key={`email_group_${i}`}>
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`email_group_check_${i}`}
                              checked={selectedEmailGroup.includes(group.configGroup)}
                              onChange={() => this.onSelectEmailGroup(group.configGroup)}
                            />
                            <label className="custom-control-label" htmlFor={`email_group_check_${i}`}>
                              <p className="font-weight-bold mb-0">{group.configGroup}</p>
                              {filteredEmailGroups[i].userNameList.map((email, k) => (
                                <p className="small-grey-text mb-0" key={`email_group_${i}_${k}`}>
                                  {email}
                                </p>
                              ))}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-8">
                  {isEmailChecked &&
                    selectedEmailGroup &&
                    selectedEmailGroup.map((item, index) => (
                      <label className="email-groups mr-2 bg-light-blue" key={`certified_emails_${index.toString()}`}>
                        {item}
                        <span onClick={() => this.onSelectEmailGroup(item)} className="ml-3">
                          X
                        </span>
                      </label>
                    ))}
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-12 justify-content-end">
                  <div className="label-group" style={{ textAlign: 'right' }}>
                    <p className="bold-text mb-0">
                      {certifiedByName} ({certifiedByDesignation})
                    </p>
                    <p className="small-grey-text mb-0">Name/Designation of Analyst Appointed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CertificationTab;

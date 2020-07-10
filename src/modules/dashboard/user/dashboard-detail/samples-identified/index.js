import React, { useState } from 'react';
import { connect } from 'react-redux';

const SamplesIdentifiedDashboard = (props) => {
  const {
    data: { sampleIdentifiedDashboardVoList },
    onChangeFilter,
    filterValue,
  } = props;

  let data = {};
  switch (filterValue.ro) {
    case 'All':
      data = sampleIdentifiedDashboardVoList?.sampleIdentifiedDashboardAllSampleVO;
      break;
    case 'CRO':
      data = sampleIdentifiedDashboardVoList?.sampleIdentifiedDashboardCroSampleVO;
      break;
    case 'ERO':
      data = sampleIdentifiedDashboardVoList?.sampleIdentifiedDashboardEroSampleVO;
      break;
    case 'WRO':
      data = sampleIdentifiedDashboardVoList?.sampleIdentifiedDashboardWroSampleVO;
      break;
    default:
      data = {};
  }

  const [selectedSpecimen, setSpecimen] = useState(data?.topOneSpecimenName);

  let topFourData = [];
  switch (selectedSpecimen) {
    case data?.topOneSpecimenName:
      topFourData = data?.oneTopFour || [];
      break;
    case data?.topTwoSpecimenName:
      topFourData = data?.twoTopFour || [];
      break;
    case data?.topThreeSpecimenName:
      topFourData = data?.threeTopFour || [];
      break;
    case data?.topFourSpecimenName:
      topFourData = data?.fourTopFour || [];
      break;
    case 'Others':
      topFourData = data?.otherTopFour || [];
      break;
    default:
      topFourData = [];
  }

  return (
    <div className="col-lg-6 mb-4 ">
      <div className="dCont ltGrey">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12 clearfix">
              <div className="fLeft paddingRight25">Sample Identified</div>
              <div className="fLeft">{sampleIdentifiedDashboardVoList?.dateRange}</div>
            </div>
          </div>
        </div>
        <div className="dCardDetails bg-white">
          <div className="row paddingBottom15">
            <div className="col-md-12 paddingTop5 paddingBottom10">
              <div className="btn-group regionBtns" role="group" aria-label="Basic example">
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'All' && 'active'}`} onClick={() => onChangeFilter({ ro: 'All' })}>
                  All
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'CRO' && 'active'}`} onClick={() => onChangeFilter({ ro: 'CRO' })}>
                  CRO
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'ERO' && 'active'}`} onClick={() => onChangeFilter({ ro: 'ERO' })}>
                  ERO
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'WRO' && 'active'}`} onClick={() => onChangeFilter({ ro: 'WRO' })}>
                  WRO
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ul className="samplesDetails">
                <li className={`cursor-pointer p-1 samplesDetails__tab ${selectedSpecimen === data?.topOneSpecimenName && 'active'}`} onClick={() => setSpecimen(data?.topOneSpecimenName)}>
                  <div className="bold-font text-bondi-blue title">{data?.topOneNo || 0}</div>
                  <div className="body2 paddingBottom5">{data?.topOneSpecimenName}</div>
                  <div>
                    {data?.topOnePercentage ? (
                      <>
                        <span className={data?.topOneGreenRed ? 'greenArrowIcon' : 'redArrowIcon'} /> {data?.topOnePercentage}%
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </li>
                <li className={`cursor-pointer p-1 samplesDetails__tab ${selectedSpecimen === data?.topTwoSpecimenName && 'active'}`} onClick={() => setSpecimen(data?.topTwoSpecimenName)}>
                  <div className="bold-font text-bondi-blue title">{data?.topTwoNo || 0}</div>
                  <div className="body2 paddingBottom5">{data?.topTwoSpecimenName}</div>
                  <div>
                    {data?.topTwoPercentage ? (
                      <>
                        <span className={data?.topTwoGreenRed ? 'greenArrowIcon' : 'redArrowIcon'} /> {data?.topTwoPercentage}%
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </li>
                <li className={`cursor-pointer p-1 samplesDetails__tab ${selectedSpecimen === data?.topThreeSpecimenName && 'active'}`} onClick={() => setSpecimen(data?.topThreeSpecimenName)}>
                  <div className="bold-font text-bondi-blue title">{data?.topThreeNo || 0}</div>
                  <div className="body2 paddingBottom5">{data?.topThreeSpecimenName}</div>
                  <div>
                    {data?.topThreePercentage ? (
                      <>
                        <span className={data?.topThreeGreenRed ? 'greenArrowIcon' : 'redArrowIcon'} /> {data?.topThreePercentage}%
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </li>
                <li className={`cursor-pointer p-1 samplesDetails__tab ${selectedSpecimen === data?.topFourSpecimenName && 'active'}`} onClick={() => setSpecimen(data?.topFourSpecimenName)}>
                  <div className="bold-font text-bondi-blue title">{data?.topFourNo || 0}</div>
                  <div className="body2 paddingBottom5">{data?.topFourSpecimenName}</div>
                  <div>
                    {data?.topFourPercentage ? (
                      <>
                        <span className={data?.topFourGreenRed ? 'greenArrowIcon' : 'redArrowIcon'} /> {data?.topFourPercentage}%
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </li>
                <li className={`cursor-pointer p-1 samplesDetails__tab ${selectedSpecimen === 'Others' && 'active'}`} onClick={() => setSpecimen('Others')}>
                  <div className="bold-font text-bondi-blue title">{data?.otherNo || 0}</div>
                  <div className="body2 paddingBottom5">Others</div>
                  <div>
                    {data?.otherPercentage ? (
                      <>
                        <span className={data?.otherGreenRed ? 'greenArrowIcon' : 'redArrowIcon'} /> {data?.otherPercentage}%
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="tabCont">
          <div>
            <div className="row">
              {topFourData.map((item, index) => (
                <div className="col-md-6 paddingBottom30" key={`top_four_${index + 1}_${item.species}`}>
                  <div className="bold-font">
                    {item.species} ({item.speciesNo})
                  </div>
                  <div>
                    {item?.speciesPercentage ? (
                      <>
                        <span className={item?.hasIncrease ? 'greenArrowIcon' : 'redArrowIcon'} /> {item?.speciesPercentage}%
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              ))}
              {/* <div className="col-md-6">
                <div className="bold-font">Aedes Albopictus (10)</div>
                <div>
                  <span className="redArrowIcon" /> 15%
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ dashboardReducers: { userDashboard } }, ownProp) => ({
  ...ownProp,
  ...userDashboard,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SamplesIdentifiedDashboard);

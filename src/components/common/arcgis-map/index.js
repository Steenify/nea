import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { loadModules } from 'esri-loader';
import { ARCGIS_HOST, ARCGIS_HOST_JS, ARCGIS_HOST_CSS } from 'constants/index';

const MapLOV = [
  { label: 'Mosquito', value: 'Mosquito', layer: 0, query: true },
  { label: 'Rodent', value: 'Rodent', layer: 0, query: true },
  { label: 'Cluster', value: 'cluster', layer: 0, query: true },
  { label: 'Postal Code', value: 'Postalcode', layer: 0, query: true },
  { label: 'DF_Case', value: 'DF_Case', layer: 0 },
  { label: 'Cluster_Localities', value: 'Cluster_Localities', layer: 1 },
  { label: 'Red_Rat_Burrow_Clusters', value: 'Red_Rat_Burrow_Clusters', layer: 2 },
  { label: 'Red_Clusters_of_Concern', value: 'Red_Clusters_of_Concern', layer: 3 },
  { label: 'Burrows', value: 'Burrows', layer: 4 },
  { label: 'Chikungunya', value: 'Chikungunya', layer: 5 },
  { label: 'Chikungunya_Cluster_Localities', value: 'Chikungunya_Cluster_Localities', layer: 6 },
  { label: 'Zika_Cases', value: 'Zika_Cases', layer: 7 },
  { label: 'Zika_Cluster_Localities', value: 'Zika_Cluster_Localities', layer: 8 },
  { label: 'Leptospirosis', value: 'Leptospirosis', layer: 9 },
  { label: 'Murine_Typhus', value: 'Murine_Typhus', layer: 10 },
  { label: 'Breeding - all', value: 'Breeding - all', layer: 11 },
  { label: 'Breeding - Aedes', value: 'Breeding - Aedes', layer: 12 },
  { label: 'Breeding - Ae. aegypti', value: 'Breeding - Ae. aegypti', layer: 13 },
  { label: 'Breeding - Ae. albopictus', value: 'Breeding - Ae. albopictus', layer: 14 },
  { label: 'Breeding - Culex', value: 'Breeding - Culex', layer: 15 },
  { label: 'Breeding - Others', value: 'Breeding - Others', layer: 16 },
  { label: 'Construction_Site', value: 'Construction_Site', layer: 17 },
  { label: 'Prison_Military_Cantonment', value: 'Prison_Military_Cantonment', layer: 18 },
  { label: 'Dengue_Risk_Map', value: 'Dengue_Risk_Map', layer: 19 },
  { label: 'Malaria_Receptive_Area', value: 'Malaria_Receptive_Area', layer: 20 },
];

class ArcgisMap extends PureComponent {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.loadMap();
  }

  componentWillUnmount() {
    if (this.view) {
      this.view.container = null;
    }
  }

  loadMap = () => {
    const { selectedLayer } = this.props;
    loadModules(['esri/config', 'esri/core/urlUtils', 'esri/Map', 'esri/views/MapView', 'esri/tasks/support/Query', 'esri/layers/GraphicsLayer', 'esri/layers/FeatureLayer'], {
      css: false,
      url: ARCGIS_HOST_JS,
    }).then(([esriConfig, urlUtils, Map, MapView, Query, GraphicsLayer, FeatureLayer]) => {
      esriConfig.request.proxyUrl = process.env.REACT_APP_ARCGIS_PROXY;
      urlUtils.addProxyRule({
        proxyUrl: process.env.REACT_APP_ARCGIS_PROXY,
        urlPrefix: process.env.REACT_APP_ARCGIS_PROXY_PREFIX,
      });
      // console.log('ArcgisMap -> loadMap -> esriConfig.request', esriConfig.request);

      const map = new Map({
        basemap: 'streets',
      });

      const initalExtent = {
        xmin: 103.702428632495,
        ymin: 1.2274784772959664,
        xmax: 103.966072911941,
        ymax: 1.4297326627915403,
        spatialReference: 4326,
      };

      this.view = new MapView({
        container: this.mapRef.current,
        map,
        extent: initalExtent,
      });
      const optionSelect = document.getElementById('attSelect');
      const doQuery = () => {
        const selectedOption = MapLOV.find((item) => item.value === optionSelect.value);

        const HeadWork = `${ARCGIS_HOST}/${selectedLayer || selectedOption.layer}`;
        console.log('ArcgisMap -> doQuery -> HeadWork', HeadWork);
        // const graphicLayer = new GraphicsLayer();
        const featureLayer = new FeatureLayer({
          url: HeadWork,
        });
        featureLayer.opacity = 0.5;
        this.view.map.layers = [featureLayer];

        // function displayResults(results) {
        //   graphicLayer.removeAll();
        //   const features = results.features.map((graphic) => {
        //     const grph = graphic;

        //     grph.symbol = {
        //       type: 'simple-marker',
        //       style: 'circle', // 'circle', 'cross', 'diamond', 'path', 'square', 'triangle', 'x'
        //       size: 8.5,
        //       color: 'darkorange',
        //     };

        //     return grph;
        //   });
        //   graphicLayer.addMany(features);
        // }

        // if (selectedOption.query) {
        //   this.view.map.layers = [graphicLayer];

        //   const query = new Query();
        //   query.returnGeometry = true;
        //   query.outFields = ['*'];
        //   const { postalCode = '' } = this.props;

        //   if (postalCode) {
        //     query.where = `Postalcode=${postalCode}`;
        //   } else if (selectedOption.value === 'Postalcode') {
        //     query.where = 'Postalcode=18960';
        //   } else {
        //     query.where = `${selectedOption.value}>20`;
        //   }
        //   featureLayer
        //     .queryFeatures(query)
        //     .then((results) => {
        //       displayResults(results);
        //     })
        //     .catch((error) => {
        //       console.log('ArcgisMap -> loadMap -> error', error);
        //     });
        // } else {
        //   this.view.map.layers = [featureLayer];
        // }
      };
      optionSelect.addEventListener('change', doQuery, false);
      doQuery();
    });
  };

  render() {
    const { isHeaderHidden = true, rightHeaderContent, rightContent } = this.props;
    return (
      <div className="area_map">
        <Helmet>
          <link rel="stylesheet" href={`${ARCGIS_HOST_CSS}`} />
        </Helmet>
        <div className="mapWrapper">
          <div className={`regionSelBox secHeader ${isHeaderHidden && 'd-none'}`}>
            <div className="row">
              <div className="col-xl-5 col-md-12 md-paddingBottom20 lg-paddingBottom20 xs-paddingBottom20  sm-paddingBottom20">
                <select defaultValue={MapLOV[0].value} className="esri-widget form-control" placeholder="Please select" id="attSelect">
                  {MapLOV.map((item, index) => (
                    <option key={`${index + 1}`} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              {rightHeaderContent && (
                <div className="col-xl-7 col-md-12 text-right">
                  {rightHeaderContent}
                  <div className="clearfix" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mapDetailCont bg-white">
          <div className="row">
            <div className={`col-md-12 ${rightContent ? 'col-xl-7' : ''}`}>
              <div id="viewDiv" ref={this.mapRef} style={{ width: '100%', height: '500px' }} />
            </div>
            {rightContent && <div className="col-xl-5 col-md-12">{rightContent}</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default ArcgisMap;

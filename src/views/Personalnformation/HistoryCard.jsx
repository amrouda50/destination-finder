import useTravelRecommenderStore from "../../store/travelRecommenderStore";
import Card from "react-bootstrap/Card";
import styles from "./VisitedHistory.module.css";
import CoverImage from "./CoverImage";
import {Col, Row} from "react-bootstrap";
import {GlobalOutlined} from "@ant-design/icons";
import {useReferencedCountry} from "../MapView/Map";
import {usePersonalInfoModal} from "./PersonalInformation";

const toUrl = (image) =>
  `${process.env.REACT_APP_STORAGE_URL}${image.attributes.url}`

const HistoryCard = ({ historyEntity }) => {
  const currentImage = historyEntity.images.data?.[0];
  const { countries } = useTravelRecommenderStore();
  const {
    setCountry: setReferencedCountry
  } = useReferencedCountry();
  const { setIsOpen } = usePersonalInfoModal();

  const currentRegion = countries?.find(country => country.properties.result.region === historyEntity.region.data?.attributes.Region);
  const regionInfo = {
    region: currentRegion?.properties.result.region,
    score: currentRegion?.properties.result.scores.totalScore
  };

  const goToMap = () => {
    if (!currentRegion) return
    setReferencedCountry(currentRegion.properties.result.id);
    setIsOpen(false);
  }

  return (
    <Card className={'rounded-4'}>
      <div
        className={`px-4 position-absolute z-3 text-white d-flex justify-content-between w-100 ${styles.historyRegion}`}
      >
        <h5 className='fa-sm'>{regionInfo.region}</h5>
        <h5 className='fa-sm'>Score: {Math.floor(regionInfo.score)}/100</h5>
      </div>
      <CoverImage
        src={currentImage ? toUrl(currentImage) : require('../../images/default-image.jpg')}
        height={'11.5rem'}
      />
      <Card.Body>
        <Row>
          <Col className={'mb-2 col-6'}>
            <h5 className='fa-xs'>Arrival: {new Date(+historyEntity.arrived * 1000).toLocaleDateString()}</h5>
          </Col>
          <Col className={'mb-2 col-6'}>
            <h5 className='fa-xs text-lg-end'>Review: {historyEntity.review}</h5>
          </Col>
        </Row>
        <Row className={'mb-2'}>
          <Col className={'mb-2 col-6'}>
            <h5 className='fa-xs'>Departure: {new Date(+historyEntity.departed * 1000).toLocaleDateString()}</h5>
          </Col>
          <Col className={'mb-2 col-6'}>
            <h5 className='fa-xs text-lg-end'>Season: {historyEntity.season ?? 'No season'}</h5>
          </Col>
        </Row>
        <Card.Title className='fs-6'>
          {historyEntity.title}
        </Card.Title>
        <Card.Text className={`${styles.description} fa-xs mb-1`}>
          {historyEntity.description}
        </Card.Text>
        <Card.Footer className='border-0 px-0'>
          <Col
            className='col-6'
            onClick={goToMap}
          >
            <button className={'btn d-flex align-items-center gap-2 text-white'}>
              <GlobalOutlined />
              <span className='fa-xs'>Show on map</span>
            </button>
          </Col>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default HistoryCard;
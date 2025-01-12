/* eslint "react/prop-types": "warn" */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import S from "./Detail.css";
import { t } from "ttag";
import cx from "classnames";

const Detail = ({
  name,
  description,
  placeholder,
  subtitleClass,
  url,
  icon,
  isEditing,
  field,
}) => (
  <div className={cx(S.detail)}>
    <div className={isEditing ? cx(S.detailBody, "flex-full") : S.detailBody}>
      <div className={S.detailTitle}>
        {url ? (
          <Link to={url} className={S.detailName}>
            {name}
          </Link>
        ) : (
          <span className={S.detailName}>{name}</span>
        )}
      </div>
      <div
        className={cx(description ? S.detailSubtitle : S.detailSubtitleLight)}
      >
        {isEditing ? (
          <textarea
            className={S.detailTextarea}
            name={field.name}
            placeholder={placeholder}
            onChange={field.onChange}
            //FIXME: use initialValues from redux forms instead of default value
            // to allow for reinitializing on cancel (see GettingStartedGuide.jsx)
            defaultValue={description}
          />
        ) : (
          <span className={subtitleClass}>
            {description || placeholder || t`No description yet`}
          </span>
        )}
        {isEditing && field.error && field.touched && (
          <span className="text-error">{field.error}</span>
        )}
      </div>
    </div>
  </div>
);

Detail.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  subtitleClass: PropTypes.string,
  icon: PropTypes.string,
  isEditing: PropTypes.bool,
  field: PropTypes.object,
};

export default React.memo(Detail);

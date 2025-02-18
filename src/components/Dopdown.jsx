import React from 'react';
import SettingInfo from '../components/SettingInfo'

export default function Dopdown({ title, data, className, value, onChange }) {
    return (
        <div className={`${className?.div || 'dopdown-container'}`}>
            {title && <span className={`${className?.title || 'dopdown-title'}`}>{title}</span>}
            <SettingInfo setting={title} />
            <select
                name={title}
                className={`${className?.select || 'dopdown-select'}`}
                value={value}
                onChange={onChange}
            >
                {data &&
                    data.map((element, index) => (
                        <option key={index} value={element.value}>
                            {element.content}
                        </option>
                    ))}
            </select>
        </div>
    );
}

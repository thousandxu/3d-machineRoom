import React from "react";

interface IProps {
    visible?: boolean;
    cabinet: any;
    style?: any;
    onClose: () => void;
}

function CabinetModal(props: IProps) {
    const { visible, style = {}, cabinet, onClose } = props;

    return (
        <div id="cabinet_modal" className="modal_warp" style={{ ...style, display: visible ? 'block' : 'none' }}>
            <span onClick={onClose}>关闭</span>
            <ul className="rask_field_warp">
                <li>
                    <span>名称：</span>
                    <span>{cabinet.name || '--'}</span>
                </li>
                <li>
                    <span>位置编号：</span>
                    <span>{cabinet.row} - {cabinet.column}</span>
                </li>
                <li>
                    <span>槽位：</span>
                    <span>{cabinet.slots || '--'}</span>
                </li>
            </ul>
        </div>
    )
}
export default CabinetModal;
/**
 * Created by LuoWen on 2016/12/3.
 */

import CONST from '../../../vfconst'

export default {

    //wrapper
    VF_LINE: ({vfCell})=> ({[CONST.CSS_NAME_VF_LINE]: vfCell.line}),
    VF_DIV: ({vfCell})=> ({[CONST.CSS_NAME_VF_DIV]: vfCell.hasStyleDiv}),
    VF_LINE_DIV: ({vfCell})=> ({[CONST.CSS_NAME_VF_LINE_DIV]: vfCell.hasStyleDivLine}),
    VF_CELL_WRAPPER_PADDING: ({vfCell})=> ({[CONST.CSS_NAME_VF_CELL_WRAPPER_PADDING]: vfCell.hasStyleCellWrapperPadding}),
    VF_DOT: ({vfCell})=> ({[CONST.CSS_NAME_VF_DOT]: vfCell.dot}),

    VF_BORROW: ({vfCell})=> ({[CONST.CSS_NAME_VF_BORROW]: vfCell.borrow}),
    VF_CARRY1: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY1]: vfCell.carry1}),
    VF_CARRY2: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY2]: vfCell.carry2}),
    VF_CARRY3: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY3]: vfCell.carry3}),
    VF_CARRY4: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY4]: vfCell.carry4}),
    VF_CARRY5: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY5]: vfCell.carry5}),
    VF_CARRY6: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY6]: vfCell.carry6}),
    VF_CARRY7: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY7]: vfCell.carry7}),
    VF_CARRY8: ({vfCell})=> ({[CONST.CSS_NAME_VF_CARRY8]: vfCell.carry8}),

    //cell
    VF_CELL_BORDER: ({vfCell})=> ({[CONST.CSS_NAME_CELL_BORDER]: vfCell.hasStyleCellBorder}),
    VF_EDITABLE_COLOR: ({vfCell})=> ({[CONST.CSS_NAME_EDITABLE_COLOR]: vfCell.hasStyleEditableColor}),
    VF_CELL_GRID: ({vfCell})=> ({[CONST.CSS_NAME_VERTICAL_CELL_GRID]: vfCell.hasStyleCellGrid}),

}
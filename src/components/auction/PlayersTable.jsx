import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as Yup from "yup";
import playersApi from "../../api/auctionPlayers";
import bidApi from "../../api/bid";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTypography,
} from "mdb-react-ui-kit";
import { rankItem } from "@tanstack/match-sorter-utils";
import React, { useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { addPlayer, updatePlayer } from "../../feature/auctionPlayers";
import { updateTeam } from "../../feature/team";
import { AlertContext } from "../../context/AlertContext";

const columnHelper = createColumnHelper();

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <MDBInput
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function PlayersTable() {
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  const dispatch = useDispatch();

  const players = useSelector((state) => state.auctionPlayers.players);

  const auction = useSelector((state) => state.auction.auction);

  const abortController = new AbortController();
  const signal = abortController.signal;

  const { showMessage } = useContext(AlertContext);

  const [isPlayerUpading, setIsPlayerUpdating] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: "",
    country: "",
    playingRole: "",
    iplMatches: "",
    cua: "",
    basePrice: "",
    ipl2022Team: "",
    auctionedPrice: "",
    imgUrl: "",
  });

  const unbidPlayerHard = (player) => {
    if (
      !window.confirm(
          "Confirm to reset player bid ! The info of the bid will be lost ! Continue ?",
      )
    ) {
      return;
    }
    bidApi
        .revertBid(auction._id, player, true, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status) {
            dispatch(updatePlayer(resp.data.player));
            if (resp.data.team) {
              dispatch(updateTeam(resp.data.team));
            }
            showMessage("Success !");
          } else {
            showMessage(`${resp.data}`);
          }
        });
  };

  const unbidAllPlayersHard = () => {
    if (
      !window.confirm(
          "Confirm to reset players bid ! The info of the bid will be lost ! Continue ?",
      )
    ) {
      return;
    }
    if (players.length) {
      for (const p of players) {
        if (!p.sold) continue;
        bidApi
            .revertBid(auction._id, p, true, signal)
            .then((resp) => resp.json())
            .then((resp) => {
              if (resp.status) {
                dispatch(updatePlayer(resp.data.player));
                if (resp.data.team) {
                  dispatch(updateTeam(resp.data.team));
                }
              } else {
                showMessage(`${resp.data}`);
              }
            });
      }
    }
  };

  const playersTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("#", {
        header: "#",
        cell: (i) => i.row.index + 1,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (i) => i.getValue(),
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: (i) => i.getValue(),
      }),
      columnHelper.accessor("basePrice", {
        header: "Base Price",
        cell: (i) => i.getValue(),
      }),
      columnHelper.accessor("auctionedPrice", {
        header: "Auctioned Price",
        cell: (i) => i.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div style={{ textAlign: "center" }}>Actions</div>,
        cell: (i) => (
          <div className="d-flex justify-content-center">
            <MDBBtn
              size="sm"
              color="link"
              onClick={() => checkAndEditPlayer(i.row.index)}
              rounded
              className="mx-1"
              disabled={auction.freeze}
            >
              edit
            </MDBBtn>
            {players[i.row.index].sold == true ? (
              <MDBBtn
                size="sm"
                color="link"
                rounded
                className="text-warning"
                disabled={auction.freeze}
                onClick={() => unbidPlayerHard(players[i.row.index])}
              >
                Unbid
              </MDBBtn>
            ) : players[i.row.index].includeInAuction == false ? (
              <MDBBtn
                size="sm"
                color="success"
                rounded
                disabled={auction.freeze}
                onClick={() => toggleIncludeAuctionPlayer(i.row.index, true)}
              >
                include
              </MDBBtn>
            ) : (
              <MDBBtn
                size="sm"
                color="link"
                rounded
                className="text-danger"
                disabled={auction.freeze}
                onClick={() => toggleIncludeAuctionPlayer(i.row.index, false)}
              >
                exclude
              </MDBBtn>
            )}
          </div>
        ),
      }),
    ];
  }, [players]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: players,
    columns: playersTableColumns,
    state: {
      pagination,
      globalFilter: globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
  });

  const resetUpdaingPlayer = () => {
    setSelectedPlayer({
      name: "",
      country: "",
      playingRole: "",
      iplMatches: "",
      cua: "",
      basePrice: "",
      ipl2022Team: "",
      auctionedPrice: "",
      imgUrl: "",
      totalRuns: "",
      battingAvg: "",
      strikeRate: "",
      wickets: "",
      economy: "",
    });
    setIsPlayerUpdating(false);
  };

  const addEditPlayer = (values, { setSubmitting }) => {
    if (isPlayerUpading) {
      values.isEdited = true;
      playersApi
          .updateAuctionPlayer(auction._id, values, signal)
          .then((resp) => resp.json())
          .then((resp) => {
            if (resp.status && resp.data) {
              dispatch(updatePlayer(resp.data));
              resetUpdaingPlayer();
              toggleOpen();
              showMessage("Success !");
            } else {
              showMessage(`${resp.errorCode} : ${resp.data}`, "error");
            }
          })
          .catch((err) => {
            showMessage(`${err}`, "error");
          });
    } else {
      values.isAdded = true;
      playersApi
          .addAuctionPlayer(auction._id, values, signal)
          .then((resp) => resp.json())
          .then((resp) => {
            if (resp.status && resp.data) {
              dispatch(addPlayer(resp.data));
              resetUpdaingPlayer();
              toggleOpen();
            } else {
              showMessage(`${resp.errorCode} : ${resp.data}`, "error");
            }
          })
          .catch((err) => {
            showMessage(`${err}`, "error");
          });
    }
  };

  const toggleIncludeAuctionPlayer = (index, state) => {
    let player = players[index];
    player = JSON.parse(JSON.stringify(player));
    player.includeInAuction = state;
    playersApi
        .updateAuctionPlayer(auction._id, player, signal)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.status && resp.data) {
            dispatch(updatePlayer(resp.data));
          } else {
            showMessage(`${resp.errorCode} : ${resp.data}`, "error");
          }
        })
        .catch((err) => {
          showMessage(`${err}`, "error");
        });
  };

  const checkAndEditPlayer = (index) => {
    const player = players[index];
    console.log(index);
    setSelectedPlayer(player);
    console.log(player);
    setIsPlayerUpdating(true);
    setBasicModal(true);
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div>
          <MDBTypography className="text-decoration-underline fs-4">
            Mangage Players
          </MDBTypography>
          <div className="my-2">
            <DebouncedInput
              label="Search in all columns"
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(value)}
            />
          </div>
          <div
            className="border rounded overflow-auto"
            style={{ maxHeight: "70vh" }}
          >
            <MDBTable striped>
              <MDBTableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder ?
                          null :
                          flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                          )}
                      </th>
                    ))}
                  </tr>
                ))}
              </MDBTableHead>
              <MDBTableBody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      players[row.index].includeInAuction == false ?
                        "table-danger" :
                        players[row.index].isAdded == true ?
                          "table-success" :
                          players[row.index].isEdited == true ?
                            "table-info" :
                            ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>
          <div>
            <div className="d-flex justify-content-evenly mt-3">
              <MDBBtn
                className="border rounded p-1"
                size="sm"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </MDBBtn>
              <MDBBtn
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </MDBBtn>
              <MDBBtn
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </MDBBtn>
              <MDBBtn
                className="border rounded p-1"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </MDBBtn>
              <span className="">
                <strong>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount().toLocaleString()}
                </strong>
              </span>
              <span className="">
                | Go to page :
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ?
                      Number(e.target.value) - 1 :
                      0;
                    table.setPageIndex(page);
                  }}
                  className="rounded w-25"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(e.target.value);
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-evenly mt-5">
            <MDBBtn size="sm" onClick={toggleOpen} disabled={auction.freeze}>
              Add Player
            </MDBBtn>
            <MDBBtn
              size="sm"
              className="btn btn-warning"
              onClick={unbidAllPlayersHard}
              disabled={auction.freeze}
            >
              Unbid All Players
            </MDBBtn>
          </div>
        </div>
      </div>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                {isPlayerUpading ? "Edit Player" : "Add Player"}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Formik
                initialValues={selectedPlayer}
                enableReinitialize
                onSubmit={addEditPlayer}
                validationSchema={Yup.object({
                  name: Yup.string().required("Required !"),
                  country: Yup.string().required("Required !"),
                  playingRole: Yup.string().required("Required"),
                  iplMatches: Yup.number().required("Required"),
                  basePrice: Yup.number().required("Required"),
                  auctionedPrice: Yup.number().required("Required"),
                  ipl2022Team: Yup.string().required("Required"),
                  imgUrl: Yup.string().required("Required !"),
                  totalRuns: Yup.number(),
                  battingAvg: Yup.number(),
                  strikeRate: Yup.number(),
                  wickets: Yup.number(),
                  economy: Yup.number(),
                })}
              >
                {(formik) => (
                  <form id="playerForm" onSubmit={formik.handleSubmit}>
                    <MDBInput
                      className="my-3"
                      label="Name"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.name}
                      </MDBTypography>
                    ) : null}
                    <MDBInput
                      className="my-3"
                      label="Country"
                      {...formik.getFieldProps("country")}
                    />
                    {formik.touched.country && formik.errors.country ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.country}
                      </MDBTypography>
                    ) : null}
                    <MDBInput
                      className="my-3"
                      label="Playing Role"
                      {...formik.getFieldProps("playingRole")}
                    />
                    {formik.touched.playingRole && formik.errors.playingRole ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.playingRole}
                      </MDBTypography>
                    ) : null}
                    <div className="d-flex justify-content-between my-2">
                      <div className="me-2">
                        <MDBInput
                          type="number"
                          label="IPL Matches"
                          {...formik.getFieldProps("iplMatches")}
                        />
                        {formik.touched.iplMatches &&
                        formik.errors.iplMatches ? (
                          <MDBTypography note noteColor="danger">
                            {formik.errors.iplMatches}
                          </MDBTypography>
                        ) : null}
                      </div>
                      <div className="mx-2">
                        <MDBInput
                          type="number"
                          label="Base Price"
                          {...formik.getFieldProps("basePrice")}
                        />
                        {formik.touched.basePrice && formik.errors.basePrice ? (
                          <MDBTypography note noteColor="danger">
                            {formik.errors.basePrice}
                          </MDBTypography>
                        ) : null}
                      </div>
                      <div className="ms-2">
                        <MDBInput
                          type="number"
                          label="Auctioned Price"
                          {...formik.getFieldProps("auctionedPrice")}
                        />
                        {formik.touched.auctionedPrice &&
                        formik.errors.auctionedPrice ? (
                          <MDBTypography note noteColor="danger">
                            {formik.errors.auctionedPrice}
                          </MDBTypography>
                        ) : null}
                      </div>
                    </div>
                    <MDBInput
                      className="my-3"
                      label="Last IPL Team"
                      {...formik.getFieldProps("ipl2022Team")}
                    />
                    {formik.touched.ipl2022Team && formik.errors.ipl2022Team ? (
                      <MDBTypography note noteColor="danger">
                        {formik.errors.ipl2022Team}
                      </MDBTypography>
                    ) : null}
                    <div className="d-flex justify-content-between my-3">
                      <MDBInput
                        label="Image URL"
                        {...formik.getFieldProps("imgUrl")}
                      />
                      {formik.touched.imgUrl && formik.errors.imgUrl ? (
                        <MDBTypography note noteColor="danger">
                          {formik.errors.imgUrl}
                        </MDBTypography>
                      ) : null}
                    </div>
                    <div className="d-flex justify-content-evenly my-3">
                      <div className="me-2">
                        <MDBInput
                          label="Total Runs"
                          {...formik.getFieldProps("totalRuns")}
                        />
                      </div>
                      <div className="mx-2">
                        <MDBInput
                          label="Batting Average"
                          {...formik.getFieldProps("battingAvg")}
                          type="number"
                        />
                      </div>
                      <div className="ms-2">
                        <MDBInput
                          label="Strike Rate"
                          {...formik.getFieldProps("strikeRate")}
                          type="number"
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <div className="me-2">
                        <MDBInput
                          type="number"
                          label="Wickets"
                          {...formik.getFieldProps("wickets")}
                        />
                      </div>
                      <div className="ms-2">
                        <MDBInput
                          label="Economy"
                          {...formik.getFieldProps("economy")}
                          type="number"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => {
                  resetUpdaingPlayer();
                  toggleOpen();
                }}
              >
                Close
              </MDBBtn>
              <MDBBtn form="playerForm" type="submit">
                {isPlayerUpading ? "Update" : "Save"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

export default PlayersTable;

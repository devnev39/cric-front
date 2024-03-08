import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as Yup from "yup";
import playersApi from "../../api/auctionPlayers";
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
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { addPlayer, updatePlayer } from "../../feature/auctionPlayers";

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
  });

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
        header: "Actions",
        cell: (i) => (
          <div className="d-flex justify-content-center">
            <MDBBtn
              size="sm"
              color="link"
              onClick={() => checkAndEditPlayer(i.row.index)}
              rounded
              className="mx-1"
            >
              edit
            </MDBBtn>
            {players[i.row.index].includeInAuction == false ? (
              <MDBBtn
                size="sm"
                color="success"
                rounded
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
              dispatch(updatePlayer(resp.data[0]));
              resetUpdaingPlayer();
              toggleOpen();
            } else {
              window.alert(`${resp.errorCode} : ${resp.data}`);
            }
          })
          .catch((err) => {
            window.alert(`${err}`);
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
              window.alert(`${resp.errorCode} : ${resp.data}`);
            }
          })
          .catch((err) => {
            window.alert(`${err}`);
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
            window.alert(`${resp.errorCode} : ${resp.data}`);
          }
        })
        .catch((err) => {
          window.alert(`${err}`);
        });
  };

  const checkAndEditPlayer = (index) => {
    const player = players[index];
    console.log(index);
    setSelectedPlayer(player);
    setIsPlayerUpdating(true);
    toggleOpen();
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
          <div className="border rounded">
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
          <div className="d-flex justify-content-center mt-5">
            <MDBBtn size="sm" onClick={toggleOpen}>
              Add Player
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
                    <MDBInput
                      className="my-3"
                      label="Country"
                      {...formik.getFieldProps("country")}
                    />
                    <MDBInput
                      className="my-3"
                      label="Playing Role"
                      {...formik.getFieldProps("playingRole")}
                    />
                    <div className="d-flex justify-content-between my-2">
                      <div className="me-2">
                        <MDBInput
                          type="number"
                          label="IPL Matches"
                          {...formik.getFieldProps("iplMatches")}
                        />
                      </div>
                      <div className="mx-2">
                        <MDBInput
                          type="number"
                          label="Base Price"
                          {...formik.getFieldProps("basePrice")}
                        />
                      </div>
                      <div className="ms-2">
                        <MDBInput
                          type="number"
                          label="Auctioned Price"
                          {...formik.getFieldProps("auctionedPrice")}
                        />
                      </div>
                    </div>
                    <MDBInput
                      className="my-3"
                      label="Last IPL Team"
                      {...formik.getFieldProps("ipl2022Team")}
                    />
                    <div className="d-flex justify-content-between my-3">
                      <MDBInput
                        label="Image URL"
                        {...formik.getFieldProps("imgUrl")}
                      />
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

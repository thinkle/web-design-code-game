import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/hotel.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import { getContentRect } from "../validation";
import {
  all,
  centerX,
  centerY,
  gapsX,
  inARow,
  keepsSize,
  near,
  one,
  paddingUnchanged,
  placedByFlexbox,
  rectsByX,
  result,
} from "./flexChecks";

const ROOM_W = 70;
const ROOM_H = 60;

export const hotelChallenge: ChallengeDefinition = {
  title: "Cat Hotel",
  language: "css",
  height: 360,
  instructions,
  html: `
<div class="hotel">
  <div class="roof">
    <div class="cat"></div>
  </div>
  <div class="rooms">
    <div class="room"><div class="cat"></div></div>
    <div class="room"><div class="cat"></div></div>
    <div class="room"><div class="cat"></div></div>
  </div>
  <div class="lobby">
    <div class="cat"></div>
    <div class="cat"></div>
  </div>
</div>
`,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    scenecss +
    `
main {
  background: linear-gradient(#cfeeff 88%, #8fc46f 88%);
  padding-bottom: 24px;
}
.hotel {
  border-bottom: 8px solid #6d6d6d;
  /* brick walls below the roof */
  background:
    repeating-linear-gradient(0deg, #b9b0a6 0 2px, transparent 2px 14px),
    repeating-linear-gradient(90deg, #c4614a 0 26px, #b9b0a6 26px 28px)
  ;
  background-size: 100% calc(100% - 60px);
  background-position: bottom;
  background-repeat: no-repeat;
}
.roof {
  /* a gable roof under the rooftop cat */
  background:
    linear-gradient(to top left, #8e3b2c 50%, transparent 50%) left bottom / 50% 36px no-repeat,
    linear-gradient(to top right, #8e3b2c 50%, transparent 50%) right bottom / 50% 36px no-repeat;
}
.room {
  box-sizing: border-box;
  border: 5px solid #fdfbf7;
  border-bottom-width: 8px;
  background: linear-gradient(#fff4c2, #ffe08a);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.25);
}
.lobby {
  box-sizing: border-box;
  background:
    /* a door and a welcome mat */
    linear-gradient(#7b4f2c, #5d3a1f) 22px bottom / 34px 48px no-repeat,
    linear-gradient(#3f6f9f, #3f6f9f) 16px bottom / 46px 3px no-repeat,
    linear-gradient(#e9e2d6, #d9cfbf);
  border-top: 6px solid #fdfbf7;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.hotel {
  width: 300px;
  height: 300px;
}

.roof {
  height: 60px;
}

.rooms {
  height: 80px;
}

.room {
  width: ${ROOM_W}px;
  height: ${ROOM_H}px;
}

.lobby {
  height: 60px;
  padding-right: 16px;
}

WORK
`,
  starterCode: `
.hotel {
  FIXME
}

.roof {

}

.rooms {

}

.room {

}

.lobby {

}
`,
  solution: `
.hotel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.roof {
  display: flex;
  justify-content: center;
}

.rooms {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.room {
  display: flex;
  justify-content: center;
  align-items: center;
}

.lobby {
  display: flex;
  justify-content: end;
  align-items: end;
  gap: 16px;
}
`,
  validate(win) {
    const hotel = one(win, ".hotel")!;
    const roof = one(win, ".roof")!;
    const roomsRow = one(win, ".rooms")!;
    const lobby = one(win, ".lobby")!;
    const rooms = all(win, ".room");
    const h = getContentRect(hotel);
    const roofRect = roof.getBoundingClientRect();
    const rowRect = roomsRow.getBoundingClientRect();
    const lobbyRect = lobby.getBoundingClientRect();

    const floorsOk =
      near(roofRect.top, h.top, 1.5) &&
      near(lobbyRect.bottom, h.bottom, 1.5) &&
      rowRect.top > roofRect.bottom + 5 &&
      rowRect.bottom < lobbyRect.top - 5;

    const roofCat = getContentRect(one(win, ".roof .cat")!);
    const roofCatOk = near(centerX(roofCat), centerX(getContentRect(roof)), 2);

    const roomRects = rectsByX(rooms);
    const roomGaps = gapsX(roomRects);
    const roomsOk =
      inARow(roomRects) &&
      roomGaps.every((g) => g >= 10 && near(g, roomGaps[0], 2));

    const catsInRooms = rooms.every((room) => {
      const cat = room.querySelector(".cat");
      if (!cat) return false;
      const c = getContentRect(cat);
      const r = getContentRect(room);
      return near(centerX(c), centerX(r), 2) && near(centerY(c), centerY(r), 2);
    });

    const lobbyBox = getContentRect(lobby);
    const greeters = rectsByX(all(win, ".lobby .cat"));
    const greetersOk =
      greeters.length === 2 &&
      near(greeters[1].right, lobbyBox.right, 2) &&
      greeters.every((g) => near(g.bottom, lobbyBox.bottom, 1.5));
    const greetersSpaced =
      greeters.length === 2 && greeters[1].left - greeters[0].right >= 8;

    return result([
      {
        name: "Roof on top, lobby at the bottom",
        isValid: floorsOk,
        message:
          "The roof should be at the very top of the hotel and the lobby at the very bottom, with the rooms in between.",
      },
      {
        name: "Rooftop cat in the middle",
        isValid: roofCatOk,
        message: "The rooftop cat should sit in the middle of the roof.",
      },
      {
        name: "Rooms spread across the floor",
        isValid: roomsOk,
        message:
          "The three rooms should sit side by side, spread out evenly across the hotel.",
      },
      {
        name: "Every room's cat is centered",
        isValid: catsInRooms,
        message:
          "Each room's cat should be right in the middle of its room, both left-right and top-bottom.",
      },
      {
        name: "Greeters on the lobby floor, on the right",
        isValid: greetersOk,
        message:
          "The two greeter cats should stand on the lobby floor, over at the right side (away from the door).",
      },
      {
        name: "Greeters have some space",
        isValid: greetersSpaced,
        message: "Give the two greeter cats some space between them.",
      },
      placedByFlexbox(win, [...all(win, ".cat"), ...rooms], "cats and rooms"),
      rooms
        .map((room) =>
          keepsSize(
            room,
            ROOM_W,
            ROOM_H,
            `Keep the rooms ${ROOM_W}px by ${ROOM_H}px: center the cats with flexbox, not padding.`,
            "Rooms keep their size"
          )
        )
        .find((item) => !item.isValid) || {
        name: "Rooms keep their size",
        isValid: true,
      },
      ...[
        paddingUnchanged(win, hotel, "hotel", {}),
        paddingUnchanged(win, roof, "roof", {}),
        paddingUnchanged(win, roomsRow, "row of rooms", {}),
        paddingUnchanged(win, lobby, "lobby", { right: 16 }),
        ...rooms.map((room) => paddingUnchanged(win, room, "room", {})),
      ].filter(
        (item, i, items) =>
          !item.isValid &&
          items.findIndex(
            (other) => other.name === item.name && !other.isValid
          ) === i
      ),
    ]);
  },
};

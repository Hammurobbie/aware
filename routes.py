def register_routes(app, app_router):
    from routers.activities import router as act_router
    from routers.wellbeing_check import router as wbc_router

    app_router.include_router(act_router)
    app_router.include_router(wbc_router)
    app.include_router(app_router)

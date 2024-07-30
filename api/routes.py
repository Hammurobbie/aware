def register_routes(app, app_router):
    from routers.activities import router as act_router
    from routers.wellbeing_checks import router as wbc_router
    from routers.emotions import router as emo_router
    from routers.meals import router as mls_router
    from routers.activity_categories import router as acs_router
    from routers.api_health_check import router as ahc_router

    app_router.include_router(act_router)
    app_router.include_router(wbc_router)
    app_router.include_router(emo_router)
    app_router.include_router(mls_router)
    app_router.include_router(acs_router)
    app_router.include_router(ahc_router)
    app.include_router(app_router)
